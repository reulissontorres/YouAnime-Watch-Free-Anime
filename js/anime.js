// Arquivo: js/anime.js

document.addEventListener('DOMContentLoaded', () => {
    const animeDetailsContainer = document.getElementById('anime-details');
    
    // Pega o parâmetro 'id' da URL
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = parseInt(urlParams.get('id')); // Converte para número

    // Função para buscar o anime específico e exibir seus detalhes
    async function fetchAnimeDetails() {
        if (!animeId) {
            animeDetailsContainer.innerHTML = '<p class="text-danger">ID do anime não fornecido.</p>';
            return;
        }

        try {
            const response = await fetch('data/animes.json');
            const animes = await response.json();
            const anime = animes.find(a => a.id === animeId);

            if (anime) {
                displayAnimeDetails(anime);
            } else {
                animeDetailsContainer.innerHTML = '<p class="text-danger">Anime não encontrado.</p>';
            }
        } catch (error) {
            console.error(error);
            animeDetailsContainer.innerHTML = '<p class="text-danger">Erro ao carregar detalhes do anime.</p>';
        }
    }

    // Função para montar o HTML da página de detalhes
    function displayAnimeDetails(anime) {
        // Informações gerais do anime
        let totalEpisodes = 0;
        anime.seasons.forEach(season => totalEpisodes += season.episodes.length);
        
        const detailsHtml = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${anime.coverImage}" class="img-fluid rounded" alt="${anime.title}">
                </div>
                <div class="col-md-8">
                    <h2>${anime.title}</h2>
                    <p><strong>Temporadas:</strong> ${anime.seasons.length}</p>
                    <p><strong>Total de Episódios:</strong> ${totalEpisodes}</p>
                    <p><strong>Áudio:</strong> ${anime.audioType}</p>
                </div>
            </div>
            <hr class="my-4 border-secondary">
            <h3 class="mb-3">Episódios</h3>
            <div id="episodes-list"></div>
        `;
        animeDetailsContainer.innerHTML = detailsHtml;

        displayEpisodes(anime, anime.seasons[0].season); // Exibe a primeira temporada por padrão
    }

    // Função para exibir a lista de episódios de uma temporada
    function displayEpisodes(anime, seasonNumber) {
        const episodesListContainer = document.getElementById('episodes-list');
        const season = anime.seasons.find(s => s.season === seasonNumber);

        if (!season) {
            episodesListContainer.innerHTML = '<p>Temporada não encontrada.</p>';
            return;
        }
        
        let episodesHtml = '<ul>';
        season.episodes.forEach(ep => {
            episodesHtml += `
                <a href="episodio.html?animeId=${anime.id}&season=${seasonNumber}&ep=${ep.episode}" class="list-group-item list-group-item-action bg-dark text-white mb-2 border-secondary rounded">
                    <div class="d-flex w-100 justify-content-start align-items-center">
                        <img src="${ep.thumbnail}" alt="Thumbnail do episódio" class="me-3" style="width: 120px; height: 68px; object-fit: cover;">
                        <div>
                           <strong>${ep.episode} - ${ep.title}</strong>
                        </div>
                    </div>
                </a>
            `;
        });
        episodesHtml += '</ul>';

        episodesListContainer.innerHTML = episodesHtml;
    }

    // Inicia o processo
    fetchAnimeDetails();
});