const filterButtons = document.querySelectorAll('[data-filter]');
for (const button of filterButtons) {
    button.addEventListener('click', () => {
        for (const other of filterButtons) {
            other.setAttribute(
                'aria-pressed',
                String(other === button)
            );
        }
        const filter = button.dataset.filter;
        const cards = document.querySelectorAll('.menu-grid li');
        for (const card of cards) {
            const category = card.dataset.category;

            card.hidden = !(filter === 'all' || category === filter);
        }
        const sections = document.querySelectorAll('.menu-section');

        for (const section of sections) {
            const visibleItems = section.querySelectorAll(
                '.menu-grid li:not([hidden])'
            );

            section.hidden = visibleItems.length === 0;
        }
        const visibleCards = document.querySelectorAll(
            '.menu-grid li:not([hidden])'
        );
        const menuStatus = document.querySelector('#menu-status');

        menuStatus.textContent =
            `Showing ${visibleCards.length} of ${cards.length} menu items.`;
    });
}
