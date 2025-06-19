  document.addEventListener('DOMContentLoaded', () => { // to run JavaScript once the page is fully loaded.
    // Portfolio menu functionality
    const portfo = document.querySelector('.portfo-menu'); // grabbing the portfo icon.
    const navMenu = document.querySelector('.nav-menu'); // getting the navigation menu itself.

    portfo.addEventListener('click', () => { // When someone clicks the portfo...
        navMenu.classList.toggle('active'); // toggle the 'active' class to show/hide the menu.
    });

    document.querySelectorAll('.nav-link').forEach(link => { // For each link in navigation...
        link.addEventListener('click', () => { // ...when it's clicked...
            navMenu.classList.remove('active'); // close the mobile menu.
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => { // To selecting all links that point to an ID on the same page.
        anchor.addEventListener('click', function (e) { // When one of these links is clicked...
            e.preventDefault(); // stop the browser's default jump.
            document.querySelector(this.getAttribute('href')).scrollIntoView({ // Then, smoothly scroll to the target section.
                behavior: 'smooth' // smooth scroll.
            });
        });
    });

    // "Back to Top" button visibility
    const backToTopButton = document.getElementById('backToTop'); // getting back-to-top button.
    window.addEventListener('scroll', () => { // listen for any scrolling on the page.
        if (window.scrollY > 300) { // If the user has scrolled down more than 300 pixels...
            backToTopButton.classList.add('visible'); // make the button visible.
        } else { // Otherwise...
            backToTopButton.classList.remove('visible'); // hide it.
        }
    });

    backToTopButton.addEventListener('click', () => { // When the back-to-top button is clicked...
        window.scrollTo({ // scroll the window.
            top: 0, // Go all the way to the top.
            behavior: 'smooth' // And do it smoothly.
        });
    });

    // General fade-in animation for elements
    const animateElements = document.querySelectorAll('.animate-fade-in'); // finding everything that needs to fade in.

    const observerOptions = { // These are the rules for when to trigger the fade-in.
        root: null, // watch relative to the main viewport.
        rootMargin: '0px', // No extra space around the viewport.
        threshold: 0.1 // Trigger when just 10% of the element is visible.
    };

    const observerCallback = (entries, observer) => { // This is what happens when an element is seen.
        entries.forEach(entry => { // For each item that's now visible...
            if (entry.isIntersecting) { // If it's actually in view...
                entry.target.classList.add('visible'); // add the 'visible' class to start the animation.
                observer.unobserve(entry.target); // done with this one, stop watching it.
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions); // setting up my main observer.
    animateElements.forEach(el => observer.observe(el)); // to observing all fade-in elements.

    // Skill bar animation on scroll
    const skillsSection = document.getElementById('skills'); // grabbing the entire skills section.
    const skillProgressBars = document.querySelectorAll('.skill-progress'); // all the individual skill bars within it.

    const skillObserverCallback = (entries, observer) => {
        entries.forEach(entry => { // For each entry (just the skills section here)...
            if (entry.isIntersecting) { // If the skills section is now visible...
                skillProgressBars.forEach(bar => { // loop through each skill bar.
                    const progress = bar.dataset.progress; //  getting the skill's percentage from its data attribute.
                    bar.style.setProperty('--skill-width', progress + '%'); // setting a CSS variable to animate its width.
                    bar.classList.add('animate'); // adding the 'animate' class to start the fill.
                });
                observer.unobserve(entry.target); // Once animated, I don't need to watch the skills section anymore.
            }
        });
    };

    const skillObserverOptions = { // These are the rules for my skill section observer.
        root: null, // Watch relative to the viewport.
        rootMargin: '0px', // No margin.
        threshold: 0.5 // Trigger when 50% of the skills section is visible.
    };

    const skillSectionObserver = new IntersectionObserver(skillObserverCallback, skillObserverOptions); // setting up the skill section observer.
    skillSectionObserver.observe(skillsSection); // working with skill section


    // --- Contact Form Validation ---
    const contactForm = document.getElementById('contactForm'); // getting the contact form.
    const formStatusMessage = document.getElementById('formStatusMessage'); // to show success/error messages for the form.

    contactForm.addEventListener('submit', function(event) { // When someone tries to submit the form...
        event.preventDefault(); // to stop the browser from doing its default submission (like reloading).

        // Clear previous errors and messages
        clearErrors(); // First, clear any old error messages or red borders.
        hideStatusMessage(); // And hide any previous overall status messages.

        let isValid = true; 

        // Validate Name
        const nameInput = document.getElementById('name'); // Get the name field.
        if (nameInput.value.trim() === '') { // If the name is empty after remove spaces
            displayError('name', 'Name is required.'); 
            isValid = false; // Mark the form as not valid.
        }

        // Validate Email
        const emailInput = document.getElementById('email'); // Get the email field.
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // This is my basic check for an email format.
        if (emailInput.value.trim() === '') { // If the email field is empty...
            displayError('email', 'Email is required.');
            isValid = false; // Invalid form.
        } else if (!emailPattern.test(emailInput.value.trim())) { // If the email doesn't look like an email...
            displayError('email', 'Please enter a valid email address.'); // ask for a valid one.
            isValid = false; // Invalid form.
        }

        // Validate Subject
        const subjectInput = document.getElementById('subject'); // Get the subject field.
        if (subjectInput.value.trim() === '') { // If the subject is empty...
            displayError('subject', 'Subject is required.'); 
            isValid = false; // Invalid form.
        }

        // Validate Message and check if the msg entered is not less than ten characters
        const messageInput = document.getElementById('message'); // Get the message field.
        if (messageInput.value.trim() === '') { // If the message is empty...
            displayError('message', 'Message is required.'); // ...it's required.
            isValid = false; // Invalid form.
        } else if (messageInput.value.trim().length < 10) { // If the message is too short (less than 10 chars)...
            displayError('message', 'Message must be at least 10 characters long.');
            isValid = false; // Invalid form.
        }

        if (isValid) { // If all my checks passed and the form is valid...
            // All validations passed.
            // For user-side only, I use a mailto link.
            const mailtoLink = `mailto:i.muvunyi@alustudent.com?subject=${encodeURIComponent(subjectInput.value.trim())}&body=${encodeURIComponent(`Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`)}`;
            window.location.href = mailtoLink; //navigating to that mailto link.

            // Display a success message after a short delay for user feedback
            displayStatusMessage('success', 'Thank you! Your message is ready to be sent in your email.'); // success messge.

            // Optionally clear the form after successful "submission"
            contactForm.reset(); // clear the form fields for them.

        } else { // If any of my validation checks failed...
            displayStatusMessage('error', 'Please correct the errors in the form.'); // shows a general error message.
        }
    });

    function displayError(fieldId, message) { // function to show an error for a specific input.
        const inputElement = document.getElementById(fieldId); // finding the actual input field.
        const formGroup = inputElement.closest('.form-group'); // getting its parent container.
        const errorMessageDiv = document.getElementById(fieldId + 'Error'); // getting the specific error message spot.

        formGroup.classList.add('error'); // makes the border red the 'error' class to the container.
        errorMessageDiv.textContent = message; // this puts the error text in place.
        errorMessageDiv.style.display = 'block'; // to make sure it's visible.
    }

    function clearErrors() { // function to clear all errors.
        document.querySelectorAll('.form-group.error').forEach(formGroup => { // finding all form groups that currently have errors.
            formGroup.classList.remove('error'); // remove the 'error' styling.
            formGroup.querySelector('.error-message').style.display = 'none'; // hide the error message.
            formGroup.querySelector('.error-message').textContent = ''; // And clear its text.
        });
    }

    function displayStatusMessage(type, message) { // showing the overall form status.
        formStatusMessage.textContent = message; // I'll set the message text.
        formStatusMessage.className = `form-message ${type}`; // apply the right styling (success or error).
        formStatusMessage.style.display = 'block'; // make it visible.
    }

    function hideStatusMessage() { // to hide the overall form status.
        formStatusMessage.style.display = 'none'; // hide the message.
        formStatusMessage.className = 'form-message'; // And reset its styling.
    }
});