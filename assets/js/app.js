// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function(form) {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        });
})()

// Current tab is set to be the first tab (0)
let currentTab = 0;

// Display the current tab
showTab(currentTab);

function showTab(n) {
    // This function will display the specified tab of the form ...
    var x = document.getElementsByClassName('tab');

    x[n].style.display = 'block';

    // ... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById('continue-shopping-btn').style.display = 'inline';
        document.getElementById('back-btn').style.display = 'none';
    } else if (n == 1) {
        document.getElementById('continue-shopping-btn').style.display = 'none';
        document.getElementById('back-btn').style.display = 'inline';
        document.getElementById('prev-btn').innerHTML = 'Return to Delivery';
    } else {
        document.getElementById('continue-shopping-btn').style.display = 'none';
        document.getElementById('back-btn').style.display = 'inline';
        document.getElementById('prev-btn').innerHTML = 'Return to Payment';
    }

    if (n == (x.length - 1)) {
        document.getElementById('next-btn').innerHTML = 'Place Order';
    } else {
        document.getElementById('next-btn').innerHTML = 'Continue';
    }


    // ... and run a function that displays the correct step indicator:
    fixStepIndicator(n)
}

function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName('tab');

    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;

    // Hide the current tab:
    x[currentTab].style.display = 'none';

    // Increase or decrease the current tab by 1:
    currentTab += n;

    // if you have reached the end of the form... :

    if (currentTab >= x.length) {
        // Make the last tab show
        showTab(2);

        //...the form gets submitted:
        $('#checkout-form').on('submit', function(e) {
            e.preventDefault();
            var form_data = $(this).serialize();
            processingAlert('Please wait while we process your order.');

            // Create an instance of the Stripe object with your publishable API key
            var stripe = Stripe('pk_test_51IpowVFPOzPM0nADVjHcbqLOBjqfRcuoxfHAzj7eeVSVMgQKexQu9mOegcfE1qNINf2J1jzxpHqC6AzbfBbFEtcX00dwY3ixUR');

            // Set up Stripe.js and Elements to use in checkout form
            var elements = stripe.elements();
            var card = elements.create('card', {
                iconStyle: 'solid',
                locale: 'auto',
                style: {
                    base: {
                        iconColor: '#c4f0ff',
                        color: '#fff',
                        fontWeight: 500,
                        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                        fontSize: '16px',
                        fontSmoothing: 'antialiased',

                        ':-webkit-autofill': {
                            color: '#fce883',
                        },
                        '::placeholder': {
                            color: '#87BBFD',
                        },
                    },
                    invalid: {
                        iconColor: '#FFC7EE',
                        color: '#FFC7EE',
                    },
                },
            });
            card.mount("#payment-card");
        });
        return false;
    }

    // Otherwise, display the correct tab:
    showTab(currentTab);

    // Preview entered details
    checkoutPreview();
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName('tab');
    y = x[currentTab].getElementsByClassName('control-input');
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
        // If a field is empty...
        if (y[i].value == '') {
            // add an "invalid" class to the field:
            y[i].className += ' invalid';
            // and set the current valid status to false:
            valid = false;
        }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid == true) {
        document.getElementsByClassName('step-indicator')[currentTab].className += ' finish';
    }
    return valid; // return the valid status
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName('step-indicator');
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(' active', '');
        x[i].className = x[i].className.replace(' completed', '');
    }
    //... and adds the "active" class to the current step:
    x[n].className += ' active';

    //... and adds the "completed" class to the previous step:
    for (i = 1; i < x.length; i++) {
        if (n - i >= 0) {
            x[n - i].className += ' completed';
        }

        // Preview entered details
        checkoutPreview();
    }
}

// RateYo Star Rating
function starRating(el, rating, size) {
    $(el).rateYo({
        rating: rating,
        starWidth: `${size}px`,
        spacing: '5px',
        ratedFill: '#212529',
        readOnly: true
    });
}

/*** Alerts ***/
// Processing request popup
function processingToast(bool) {
    iziToast.show({
        animateInside: true,
        theme: 'dark',
        timeout: bool,
        closeOnClick: false,
        overlay: true,
        close: false,
        closeOnEscape: false,
        closeOnClick: false,
        drag: false,
        progressBar: false,
        icon: '',
        image: `../images/preloaders/animated-spinner.svg`,
        imageWidth: 50,
        message: 'Processing your request...',
        messageColor: '#fff',
        position: 'center',
        zindex: 9999,
    });
}

// General info alert
function infoAlert(message) {
    iziToast.show({
        animateInside: true,
        theme: 'dark',
        timeout: 5000,
        closeOnClick: true,
        close: false,
        progressBar: false,
        backgroundColor: 'var(--primary)',
        icon: 'bi bi-info-circle text-white',
        message: message,
        messageColor: '#fff',
        position: 'center'
    });
}

// SweetAlert2 success
function swalSuccess(message) {
    Swal.fire(
        '',
        message,
        'success',
    );
}

// General success alert message
function successAlert(message) {
    iziToast.show({
        animateInside: true,
        theme: 'dark',
        timeout: 2000,
        closeOnClick: true,
        overlay: false,
        close: false,
        backgroundColor: 'var(--success)',
        progressBar: false,
        icon: 'bi bi-check2-circle text-light',
        message: message,
        messageColor: '#fff',
        position: 'center'
    });
}

// Success alert message with gift image
function giftSuccessAlert(product_image, message) {
    iziToast.show({
        animateInside: true,
        theme: 'dark',
        timeout: 3000,
        closeOnClick: true,
        overlay: false,
        close: false,
        backgroundColor: 'var(--success)',
        progressBar: false,
        icon: 'bi bi-check2-circle text-light',
        image: `../images/products/${product_image}`,
        imageWidth: 60,
        message: message,
        messageColor: '#fff',
        position: 'topCenter'
    });
}

// General warning alert
function warningAlert(message) {
    iziToast.warning({
        animateInside: true,
        theme: 'dark',
        timeout: 5000,
        closeOnClick: true,
        close: false,
        progressBar: false,
        backgroundColor: 'var(--warning)',
        icon: 'bi bi-exclamation-circle text-dark',
        message: message,
        messageColor: '#000',
        position: 'center'
    });
}

// Offline alert
function offlineAlert(message) {
    iziToast.warning({
        animateInside: true,
        theme: 'dark',
        timeout: 5000,
        closeOnClick: true,
        close: false,
        progressBar: false,
        backgroundColor: 'var(--warning)',
        icon: 'bi bi-wifi-off text-dark',
        message: message,
        messageColor: '#000',
        position: 'center'
    });
}

// SweetAlert2 pop-up question
function deleteAlert(title, message, btnText, el, id, url) {
    Swal.fire({
        title: title,
        text: message,
        icon: 'question',
        backdrop: 'swal2-backdrop-show',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: btnText
    }).then((result) => {
        if (result.value) {
            removeItem(el, id);
            $.ajax({
                url: url,
                method: 'delete',
                data: { id: id },
                dataType: 'json',
                success: function(data) {
                    if (data.message == 'success') {
                        successAlert('Deleted successfully!');
                        location.reload();
                    } else {
                        warningAlert('Oops! Something went wrong!');
                    }
                },
                error: function() {
                    offlineAlert('Hmmm... looks like you\'re nolonger connected.');
                }
            });
        }
    });
}
/*** /.Alerts ***/

$(function() {
    // Pass the csrf token to all ajax calls
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Enable popovers and tooltips
    $('[data-bs-toggle="popover"]').popover();
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Toggle scroll to top button
    $(window).on('scroll', function() {
        if ($(this).scrollTop() - 200 > 0) {
            // Show button
            $('.to-top').stop().addClass('show');
        } else {
            // Hide button
            $('.to-top').stop().removeClass('show');
        }
    });

    //Get the button
    $(window).on('scroll', function() {
        if ($(document).height() >= $(window).height()) {
            $('#scroll-top').css('display', 'block');
        } else {
            $('#scroll-top').css('display', 'none');
        }
    });

    /*** Lazy load images ***/
    let lazyLoadImages;
    if ('IntersectionObserver' in window) {
        lazyLoadImages = document.querySelectorAll('.lazy');
        let imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.remove('lazy');
                    imageObserver.unobserve(image);
                }
            });
        });
        lazyLoadImages.forEach(function(image) {
            imageObserver.observe(image);
        });
    } else {
        let lazyLoadThrottleTimeout;
        lazyLoadImages = document.querySelectorAll('.lazy');

        function lazyLoading() {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }
            lazyLoadThrottleTimeout = setTimeout(() => {
                let scrollTop = window.pageYOffset;
                lazyLoadImages.forEach(function(img) {
                    if (img.offsetTop < window.innerHeight + scrollTop) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                });
                if (lazyLoadImages.length == 0) {
                    document.removeEventListener('scroll', lazyLoading);
                    window.removeEventListener('resize', lazyLoading);
                    window.removeEventListener('orientationChange', lazyLoading);
                }
            }, 20);
        }
        document.addEventListener('scroll', lazyLoading);
        window.addEventListener('resize', lazyLoading);
        window.addEventListener('orientationChange', lazyLoading);
    }
    /*** /.Lazy load images ***/

    $('.nav.nav-underline>.nav-link').on('click', function(e) {
        e.preventDefault();
        $(this).addClass('active');
        $('.nav.nav-underline>.nav-link').not(this).removeClass('active');
    });
});