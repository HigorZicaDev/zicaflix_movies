// Obtenção dos elementos do diálogo e do vídeo
const videoDialog = document.getElementById("video-dialog");
const introVideo = document.getElementById("intro-video");
const loading = document.getElementById("loading");

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
        1500: { slidesPerView: 4 },
        1200: { slidesPerView: 3 },
        768: { slidesPerView: 2 },
        400: { slidesPerView: 1 },
      },
    });
  });
};

// Função para carregar filmes e agrupar por ano
async function loadMovies() {
  try {
	//PRODUCTION
    const response = await fetch("https://api-movies-06ts.onrender.com/api/movies");
	//LOCAL
    // const response = await fetch("http://localhost:3001/api/movies");
    const data = await response.json();

    const moviesByYear = {};
    for (const movie of data.movies) {
      const year = movie.year;
      if (!moviesByYear[year]) {
        moviesByYear[year] = [];
      }
      moviesByYear[year].push(movie);
    }

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

        const cardContainer = document.createElement("div");
        cardContainer.classList.add("card-container");

        const img = document.createElement("img");
        img.src = `https://api-movies-06ts.onrender.com${movie.image_url}`;
        img.alt = movie.title;
        cardContainer.appendChild(img);

        const button = document.createElement("button");
        button.classList.add("btn_movie");
        button.textContent = "Assistir";

        const btnLike = document.createElement("button");
        btnLike.classList.add("btn_movie_like");
        btnLike.textContent = "Like";

        // Evento de clique para abrir o modal ao clicar em "Assistir"
        btnLike.addEventListener("click", () => {
			alert("You Like : " + movie.title);
		  });

        // Evento de clique para abrir o modal ao clicar em "Assistir"
        button.addEventListener("click", () => {
			videoDialog.style.display = "flex"; // Mostra o modal
			videoDialog.showModal();
			introVideo.muted = true;
			introVideo.addEventListener("canplaythrough", () => {
				// O vídeo está pronto para ser reproduzido
				let playVideo = introVideo.play();
				if (playVideo !== undefined) {
					playVideo
						.then(() => {
							console.log("Video started automatically.");
						})
						.catch(error => {
							console.log("Error: " + error);
						});
				}
			});
			// let playVideo = introVideo.play();
			// if (playVideo !== undefined) {
			// 	playVideo
			// 		.then(() => {
			// 			// Reprodução automática foi bem-sucedida
			// 			console.log("Video started successfully.");
			// 			// Aqui você pode adicionar a lógica para mostrar a interface de vídeo em reprodução
			// 		})
			// 		.catch(error => {
			// 			console.log("Error : " + error);
			// 			// Exibe um aviso ou sugere ao usuário clicar no botão de play
			// 		});
			// }
		  });
  
		  const closeButton = videoDialog.querySelector(".close-dialog");
		  closeButton.addEventListener("click", () => {
			videoDialog.close();
			videoDialog.style.display = "none"; // Oculta o modal
			introVideo.muted = true;
			let pauseVideo = introVideo.pause();
			if (pauseVideo !== undefined) {
				pauseVideo
					.then(() => {
						// Reprodução automática foi bem-sucedida
						console.log("Video started successfully.");
						introVideo.currentTime = 0;
						// Aqui você pode adicionar a lógica para mostrar a interface de vídeo em reprodução
					})
					.catch(error => {
						console.log("Error : " + error);
						// Exibe um aviso ou sugere ao usuário clicar no botão de play
					});
			}

		  });

        cardContainer.appendChild(button);
        cardContainer.appendChild(btnLike);
        slide.appendChild(cardContainer);
        swiperWrapper.appendChild(slide);
      });

      swiperContainer.appendChild(swiperWrapper);
      row.appendChild(swiperContainer);
      movieContainer.appendChild(row);
    }

    initSwiper();

  } catch (error) {
    console.error("Error fetching movies:", error);
  } finally {
	loading.style.display = "none";
  }
}
