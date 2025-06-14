document.addEventListener('DOMContentLoaded', () => {
    const animeListContainer = document.getElementById('anime-list');

    // Função para buscar e exibir os animes
    async function fetchAnimes() {
        try {
            const response = await fetch('animes.json');
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON.');
            }
            const animes = await response.json();
            displayAnimes(animes);
        } catch (error) {
            console.error(error);
            animeListContainer.innerHTML = '<p class="text-danger">Não foi possível carregar a lista de animes.</p>';
        }
    }

    // Função para criar os cards dos animes na página
    function displayAnimes(animes) {
        animeListContainer.innerHTML = ''; // Limpa a área antes de adicionar os novos cards

        animes.forEach(anime => {
            const animeCard = `
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <a href="anime.html?id=${anime.id}" class="text-decoration-none">
                        <div class="card bg-dark border-secondary h-100">
                            <img src="${anime.coverImage}" class="card-img-top" alt="${anime.title}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title text-white">${anime.title}</h5>
                                <span class="badge ${anime.audioType === 'Dublado' ? 'bg-info' : 'bg-primary'} mt-auto align-self-start">${anime.audioType}</span>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            animeListContainer.innerHTML += animeCard;
        });
    }

    // Inicia o processo
    fetchAnimes();
});