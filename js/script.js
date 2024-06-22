document.addEventListener('DOMContentLoaded', function() {
    // Menu and Navbar Toggle
    let menu = document.querySelector('#menu-btn');
    let navbar = document.querySelector('.navbar');

    menu.onclick = () => {
        menu.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    };

    window.onscroll = () => {
        menu.classList.remove('fa-times');
        navbar.classList.remove('active');
    };

    // Image Slider Functionality
    document.querySelectorAll('.image-slider img').forEach(images => {
        images.onclick = () => {
            var src = images.getAttribute('src');
            document.querySelector('.main-home-image').src = src;
        };
    });

    // Swiper Configuration
    var swiper = new Swiper(".review-slider", {
        spaceBetween: 20,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 7500,
            disableOnInteraction: false,
        },
        breakpoints: {
            0: {
                slidesPerView: 1
            },
            768: {
                slidesPerView: 2
            }
        },
    });

    // Load existing reviews from localStorage
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.forEach(review => appendReview(review));

    // Form Submission
    document.getElementById('reviewForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const reviewerName = document.getElementById('reviewerName').value;
        const cafeName = document.getElementById('cafeName').value;
        const reviewContent = document.getElementById('reviewContent').value;
        const reviewImage = document.getElementById('reviewImage').files[0];
        const reviewRating = document.getElementById('reviewRating').value;

        if (reviewerName && cafeName && reviewContent && reviewImage && reviewRating) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const review = {
                    reviewerName,
                    cafeName,
                    reviewContent,
                    reviewImage: event.target.result,
                    reviewRating
                };

                // Save review to localStorage
                reviews.push(review);
                localStorage.setItem('reviews', JSON.stringify(reviews));

                // Append review to page
                appendReview(review);
                document.getElementById('reviewForm').reset();
            };
            reader.readAsDataURL(reviewImage);
        } else {
            alert('Please fill out all fields and upload an image.');
        }
    });

    // Append Review Function
    function appendReview(review) {
        const starsHTML = Array.from({ length: review.reviewRating }, () => '<i class="fas fa-star"></i>').join('');

        const reviewHTML = `
            <div class="swiper-slide box">
                <i class="fas fa-quote-left"></i>
                <i class="fas fa-quote-right"></i>
                <img src="${review.reviewImage}" alt="Review Image">
                <div class="stars">
                    ${starsHTML}
                </div>
                <p>${review.reviewContent}</p>
                <h3>${review.cafeName}</h3>
                <span>${review.reviewerName}</span>
            </div>
        `;

        const swiperWrapper = document.querySelector('.swiper-wrapper');
        swiperWrapper.insertAdjacentHTML('beforeend', reviewHTML);
        swiper.update();
    }
});
