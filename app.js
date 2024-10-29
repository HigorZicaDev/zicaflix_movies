// Função para iniciar o vídeo de fundo e tratar erros de reprodução
document.addEventListener("DOMContentLoaded", () => {
	const video = document.querySelector(".background-video");

	// Iniciar o vídeo de fundo e tratar erros de reprodução
	video.play().catch(function (error) {
		console.log("Video autoplay failed:", error);
	});

	video.addEventListener("error", function (e) {
		console.log("Video error:", e);
		document.querySelector(".background-video-container").style.display = "none";
	});

	// Chama a função para buscar e exibir os filmes ao carregar a página
	loadMovies();
});

// Configuração do Swiper para os carrosséis de filmes
const initSwiper = () => {
	const swipers = document.querySelectorAll('.swiper');
	swipers.forEach((element) => {
		new Swiper(element, {
			slidesPerView: 3,
			spaceBetween: 20,
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			breakpoints: {
				1500: {
					slidesPerView: 4, // 3 slides quando a largura da tela for maior que 1000px
				},
				1200: {
					slidesPerView: 3, // 2 slides quando a largura da tela for maior que 768px
				},
				768: {
					slidesPerView: 2, // 2 slides quando a largura da tela for maior que 768px
				},
				400: {
					slidesPerView: 1, // 1 slide quando a largura da tela for maior que 480px
				},
			},
		});
	});
};

// Função para carregar filmes e agrupar por ano
async function loadMovies() {
	try {
		const response = await fetch("https://api-movies-06ts.onrender.com/api/movies");
		const data = await response.json();

		// Agrupa os filmes por ano sem usar o método reduce
		const moviesByYear = {};
		for (const movie of data.movies) {
			const year = movie.year;
			if (!moviesByYear[year]) {
				moviesByYear[year] = [];
			}
			moviesByYear[year].push(movie);
		}

		// Seleciona o container dos filmes e exibe os carrosséis
		const movieContainer = document.getElementById("movie-container");
		movieContainer.innerHTML = ''; // Limpa o conteúdo inicial

		for (const year in moviesByYear) {
			const row = document.createElement("div");
			row.classList.add("row");

			const rowHeader = document.createElement("h2");
			rowHeader.classList.add("row-header");
			rowHeader.textContent = `YEAR - ${year}`;
			row.appendChild(rowHeader);

			const swiperContainer = document.createElement("div");
			swiperContainer.classList.add("swiper");

			const swiperWrapper = document.createElement("div");
			swiperWrapper.classList.add("swiper-wrapper");

			moviesByYear[year].forEach((movie) => {
				const slide = document.createElement("div");
				slide.classList.add("swiper-slide");

				// Criação do contêiner para a imagem e o botão
				const cardContainer = document.createElement("div");
				cardContainer.classList.add("card-container");

				const img = document.createElement("img");
				img.src = `https://api-movies-06ts.onrender.com${movie.image_url}`;
				img.alt = movie.title;
				cardContainer.appendChild(img);

				// Criação do botão
				const button = document.createElement("button");
				button.classList.add("btn_movie"); // Adiciona uma classe para estilização
				button.textContent = "Assistir"; // Texto do botão

				// Adiciona um evento de clique ao botão
				button.addEventListener("click", () => {
					alert(`Você clicou em Assistir: ${movie.title}`);
					// Aqui você pode adicionar a lógica que desejar, como redirecionar ou abrir um modal
				});

				// Criação do botão
				const like = document.createElement("button");
				like.classList.add("btn_movie_like"); // Adiciona uma classe para estilização
				like.textContent = "Like"; // Texto do botão

				// Adiciona um evento de clique ao botão
				like.addEventListener("click", () => {
					alert(`Você deu Like em: ${movie.title}`);
					// Aqui você pode adicionar a lógica que desejar, como redirecionar ou abrir um modal
				});

				// Adiciona o botão ao contêiner do card
				cardContainer.appendChild(button);
				cardContainer.appendChild(like);
				slide.appendChild(cardContainer); // Adiciona o contêiner do card ao slide

				swiperWrapper.appendChild(slide);
			});

			swiperContainer.appendChild(swiperWrapper);
			row.appendChild(swiperContainer);
			movieContainer.appendChild(row);
		}

		// Inicia os carrosséis Swiper
		initSwiper();

	} catch (error) {
		console.error("Error fetching movies:", error);
	}
}

