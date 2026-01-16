// ============================================
// Streak Store - handles localStorage persistence
// ============================================
class StreakStore {
    static STORAGE_KEY = 'streaks';

    static getDefaultStreaks() {
        return {
            diet: { name: 'Diet', streak_start: null, streak_end: null },
            workout: { name: 'Workout', streak_start: null, streak_end: null },
            reading: { name: 'Reading', streak_start: null, streak_end: null },
            meditation: { name: 'Meditation', streak_start: null, streak_end: null }
        };
    }

    static load() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        const defaults = this.getDefaultStreaks();
        this.save(defaults);
        return defaults;
    }

    static save(streaks) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(streaks));
    }

    static updateStreak(id, updates) {
        const streaks = this.load();
        if (streaks[id]) {
            streaks[id] = { ...streaks[id], ...updates };
            this.save(streaks);
        }
        return streaks;
    }

    static addStreak(name) {
        const streaks = this.load();
        const id = name.toLowerCase().replace(/\s+/g, '-');
        if (!streaks[id]) {
            streaks[id] = { name, streak_start: null, streak_end: null };
            this.save(streaks);
        }
        return streaks;
    }

    static removeStreak(id) {
        const streaks = this.load();
        delete streaks[id];
        this.save(streaks);
        return streaks;
    }
}

// ============================================
// Helper functions
// ============================================
function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

function calculateDays(streak_start, streak_end) {
    if (!streak_start || !streak_end) return 0;
    
    const today = new Date(getTodayString());
    const startDate = new Date(streak_start);
    const endDate = new Date(streak_end);
    
    // Use max(today, streak_end) for calculation
    const effectiveEnd = today > endDate ? today : endDate;
    
    const diffTime = effectiveEnd - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

// ============================================
// Streak Card Web Component
// ============================================
class StreakCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['streak-id', 'name', 'streak-start', 'streak-end'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    get streakId() {
        return this.getAttribute('streak-id');
    }

    get name() {
        return this.getAttribute('name') || 'Unnamed';
    }

    get streakStart() {
        const val = this.getAttribute('streak-start');
        return val === 'null' || !val ? null : val;
    }

    get streakEnd() {
        const val = this.getAttribute('streak-end');
        return val === 'null' || !val ? null : val;
    }

    get days() {
        return calculateDays(this.streakStart, this.streakEnd);
    }

    handleDidIt() {
        const today = getTodayString();
        let newStart = this.streakStart;
        let newEnd = today;

        if (!this.streakEnd) {
            // First time pressing - set both to today
            newStart = today;
            newEnd = today;
        }

        this.dispatchEvent(new CustomEvent('streak-update', {
            bubbles: true,
            composed: true,
            detail: {
                id: this.streakId,
                streak_start: newStart,
                streak_end: newEnd
            }
        }));
    }

    handleReset() {
        this.dispatchEvent(new CustomEvent('streak-update', {
            bubbles: true,
            composed: true,
            detail: {
                id: this.streakId,
                streak_start: null,
                streak_end: null
            }
        }));
    }

    handleDelete() {
        this.dispatchEvent(new CustomEvent('streak-delete', {
            bubbles: true,
            composed: true,
            detail: { id: this.streakId }
        }));
    }

    render() {
        const days = this.days;
        const isActive = this.streakStart !== null;
        const startDisplay = this.streakStart || '—';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .card {
                    background: #1a1a24;
                    border: 1px solid #2a2a3a;
                    border-radius: 12px;
                    padding: 1.5rem;
                    display: grid;
                    grid-template-columns: 1fr auto;
                    gap: 1rem;
                    align-items: center;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .card:hover {
                    border-color: #3a3a4a;
                }

                .card.active {
                    border-color: rgba(34, 197, 94, 0.3);
                    box-shadow: 0 0 20px rgba(34, 197, 94, 0.1);
                }

                .info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .name {
                    font-family: 'Outfit', sans-serif;
                    font-size: 1.25rem;
                    font-weight: 500;
                    color: #f0f0f5;
                }

                .days {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: ${isActive ? '#22c55e' : '#8888a0'};
                    line-height: 1;
                }

                .days-label {
                    font-size: 0.875rem;
                    color: #8888a0;
                }

                .meta {
                    font-size: 0.75rem;
                    color: #6666780;
                    margin-top: 0.5rem;
                }

                .actions {
                    display: flex;
                    gap: 0.5rem;
                    flex-direction: column;
                }

                button {
                    font-family: 'Outfit', sans-serif;
                    border: none;
                    border-radius: 8px;
                    padding: 0.75rem 1.25rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                button:active {
                    transform: scale(0.96);
                }

                .btn-green {
                    background: #22c55e;
                    color: white;
                }

                .btn-green:hover {
                    background: #16a34a;
                    box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
                }

                .btn-red {
                    background: #ef4444;
                    color: white;
                }

                .btn-red:hover {
                    background: #dc2626;
                    box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
                }

                .btn-delete {
                    background: transparent;
                    color: #8888a0;
                    padding: 0.5rem;
                    font-size: 0.75rem;
                }

                .btn-delete:hover {
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                }

                @media (max-width: 500px) {
                    .card {
                        grid-template-columns: 1fr;
                    }

                    .actions {
                        flex-direction: row;
                        justify-content: flex-start;
                    }
                }
            </style>

            <div class="card ${isActive ? 'active' : ''}">
                <div class="info">
                    <span class="name">${this.name}</span>
                    <span class="days">${days}</span>
                    <span class="days-label">${days === 1 ? 'day' : 'days'} on streak</span>
                    ${isActive ? `<span class="meta">Started: ${startDisplay}</span>` : ''}
                </div>
                <div class="actions">
                    <button class="btn-green" id="did-it">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Did it today
                    </button>
                    <button class="btn-red" id="reset">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                            <path d="M3 3v5h5"></path>
                        </svg>
                        Reset
                    </button>
                    <button class="btn-delete" id="delete">Remove streak</button>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById('did-it').addEventListener('click', () => this.handleDidIt());
        this.shadowRoot.getElementById('reset').addEventListener('click', () => this.handleReset());
        this.shadowRoot.getElementById('delete').addEventListener('click', () => this.handleDelete());
    }
}

customElements.define('streak-card', StreakCard);

// ============================================
// Streak App Web Component
// ============================================
class StreakApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.streaks = {};
    }

    connectedCallback() {
        this.streaks = StreakStore.load();
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for streak updates from cards
        this.addEventListener('streak-update', (e) => {
            const { id, streak_start, streak_end } = e.detail;
            this.streaks = StreakStore.updateStreak(id, { streak_start, streak_end });
            this.render();
        });

        // Listen for streak deletions
        this.addEventListener('streak-delete', (e) => {
            const { id } = e.detail;
            this.streaks = StreakStore.removeStreak(id);
            this.render();
        });
    }

    handleAddStreak(name) {
        if (name.trim()) {
            this.streaks = StreakStore.addStreak(name.trim());
            this.render();
        }
    }

    render() {
        const streakEntries = Object.entries(this.streaks);

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .add-streak-form {
                    display: flex;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                    justify-content: center;
                }

                .add-streak-form input {
                    font-family: 'Outfit', sans-serif;
                    padding: 0.75rem 1rem;
                    border: 1px solid #2a2a3a;
                    border-radius: 8px;
                    background: #12121a;
                    color: #f0f0f5;
                    font-size: 1rem;
                    width: 250px;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .add-streak-form input:focus {
                    outline: none;
                    border-color: #22c55e;
                    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
                }

                .add-streak-form input::placeholder {
                    color: #8888a0;
                }

                .add-streak-form button {
                    font-family: 'Outfit', sans-serif;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    background: #22c55e;
                    color: white;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.1s;
                }

                .add-streak-form button:hover {
                    background: #16a34a;
                }

                .add-streak-form button:active {
                    transform: scale(0.98);
                }

                .streaks-grid {
                    display: grid;
                    gap: 1rem;
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem;
                    color: #8888a0;
                }

                .empty-state p {
                    margin-bottom: 0.5rem;
                }
            </style>

            <form class="add-streak-form" id="add-form">
                <input type="text" id="streak-name" placeholder="New streak name..." autocomplete="off">
                <button type="submit">Add Streak</button>
            </form>

            <div class="streaks-grid">
                ${streakEntries.length === 0 
                    ? `<div class="empty-state">
                        <p>No streaks yet!</p>
                        <p>Add your first streak above to get started.</p>
                       </div>`
                    : streakEntries.map(([id, streak]) => `
                        <streak-card
                            streak-id="${id}"
                            name="${streak.name}"
                            streak-start="${streak.streak_start}"
                            streak-end="${streak.streak_end}"
                        ></streak-card>
                    `).join('')
                }
            </div>
        `;

        // Setup form submission
        const form = this.shadowRoot.getElementById('add-form');
        const input = this.shadowRoot.getElementById('streak-name');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddStreak(input.value);
            input.value = '';
        });
    }
}

customElements.define('streak-app', StreakApp);
