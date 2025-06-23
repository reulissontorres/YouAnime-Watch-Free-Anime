// Arquivo: js/episodio.js

document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('youtube-player');
    const episodeInfoContainer = document.getElementById('episode-info');
    const episodeNavContainer = document.getElementById('episode-navigation');

    const urlParams = new URLSearchParams(window.location.search);
    const animeId = parseInt(urlParams.get('animeId'));
    const seasonNumber = parseInt(urlParams.get('season'));
    const episodeNumber = parseInt(urlParams.get('ep'));

    async function fetchEpisode() {
        if (!animeId || !seasonNumber || !episodeNumber) {
            episodeInfoContainer.innerHTML = '<h2 class="text-danger">Informações do episódio inválidas.</h2>';
            return;
        }

        try {
            const response = await fetch('data/animes.json');
            const animes = await response.json();
            const anime = animes.find(a => a.id === animeId);
            
            if (!anime) { throw new Error('Anime não encontrado.'); }

            const season = anime.seasons.find(s => s.season === seasonNumber);
            if (!season) { throw new Error('Temporada não encontrada.'); }
            
            const episode = season.episodes.find(e => e.episode === episodeNumber);
            if (!episode) { throw new Error('Episódio não encontrado.'); }

            displayEpisode(anime, season, episode);
            setupNavigation(anime, season, episode);

        } catch (error) {
            console.error(error);
            episodeInfoContainer.innerHTML = `<h2 class="text-danger">${error.message}</h2>`;
        }
    }

    function displayEpisode(anime, season, episode) {
        // Atualiza o título da página
        document.title = `${anime.title} - Ep ${episode.episode}`;
        
        // Insere o título na página
        episodeInfoContainer.innerHTML = `
            <h2>${anime.title}</h2>
            <h4>Episódio ${episode.episode}: ${episode.title}</h4>
        `;
        
        // Monta a URL do YouTube e a insere no iframe
        player.src = `https://www.youtube.com/embed/${episode.youtubeId}`;
    }

    function setupNavigation(anime, currentSeason, currentEpisode) {
        let prevEpLink = '#';
        let nextEpLink = '#';
        let prevDisabled = 'disabled';
        let nextDisabled = 'disabled';

        // Lógica para episódio anterior
        const prevEpisode = currentSeason.episodes.find(ep => ep.episode === currentEpisode.episode - 1);
        if (prevEpisode) {
            prevEpLink = `episodio.html?animeId=${anime.id}&season=${currentSeason.season}&ep=${prevEpisode.episode}`;
            prevDisabled = '';
        }

        // Lógica para próximo episódio
        const nextEpisode = currentSeason.episodes.find(ep => ep.episode === currentEpisode.episode + 1);
        if (nextEpisode) {
            nextEpLink = `episodio.html?animeId=${anime.id}&season=${currentSeason.season}&ep=${nextEpisode.episode}`;
            nextDisabled = '';
        }

        episodeNavContainer.innerHTML = `
            <a href="${prevEpLink}" class="btn btn-primary ${prevDisabled}">
                &laquo; Episódio Anterior
            </a>
            <a href="anime.html?id=${anime.id}" class="btn btn-secondary">
                Lista de Episódios
            </a>
            <a href="${nextEpLink}" class="btn btn-primary ${nextDisabled}">
                Próximo Episódio &raquo;
            </a>
        `;
    }

    fetchEpisode();
});