const form = document.getElementById('form');
const day = document.getElementById('day');
const month = document.getElementById('month');
const year = document.getElementById('year');
const days = document.getElementById('days');
const months = document.getElementById('months');
const years = document.getElementById('years');

const currentDate = new Date();

const errorMessages = {
    required: 'This field is required',
    invalid: (str) => `Must be a valid ${str}`,
    range: 'Must be in the past',
};

year.setAttribute('max', currentDate.getFullYear());

const validateForm = (e) => {
    e.preventDefault();
    const [dd, mm, yyyy] = [day.value, month.value, year.value];

    const daysInMonth = new Date(yyyy, mm, 0).getDate();
    day.setAttribute('max', daysInMonth);

    const isFuture = currentDate.getTime() < new Date(yyyy, mm - 1, dd).getTime();

    // Validate year
    if (year.validity.valueMissing) {
        year.setCustomValidity(errorMessages.required);
    } else if (year.validity.rangeUnderflow) {
        year.setCustomValidity(errorMessages.invalid('year'));
    } else if (year.validity.rangeOverflow || isFuture) {
        year.setCustomValidity(errorMessages.range);
    } else {
        year.setCustomValidity('');
    }
    year.nextElementSibling.textContent = year.validationMessage;

    // Validate month
    if (month.validity.valueMissing) {
        month.setCustomValidity(errorMessages.required);
    } else if (
        month.validity.rangeUnderflow ||
        month.validity.rangeOverflow
    ) {
        month.setCustomValidity(errorMessages.invalid('month'));
    } else {
        month.setCustomValidity('');
    }
    month.nextElementSibling.textContent = month.validationMessage;

    // Validate day
    if (day.validity.valueMissing) {
        day.setCustomValidity(errorMessages.required);
    } else if (
        year.checkValidity() &&
        month.checkValidity() &&
        day.validity.rangeOverflow
    ) {
        day.setCustomValidity(errorMessages.invalid('date'));
    } else if (
        day.validity.rangeUnderflow ||
        day.validity.rangeOverflow
    ) {
        day.setCustomValidity(errorMessages.invalid('day'));
    } else {
        day.setCustomValidity('');
    }
    day.nextElementSibling.textContent = day.validationMessage;

    // if all is ok calculate the age else reset results
    if (
        day.checkValidity() &&
        month.checkValidity() &&
        year.checkValidity()
    ) {
        calculateAge(dd, mm, yyyy);
    } else {
        days.textContent =
            months.textContent =
            years.textContent =
            '- -';
    }
};

const calculateAge = (day, month, year) => {
    const birthDate = new Date(year, month - 1, day);

    let ageYears = currentDate.getFullYear() - birthDate.getFullYear();
    let ageMonths = currentDate.getMonth() - birthDate.getMonth();
    let ageDays = currentDate.getDate() - birthDate.getDate();

    // If the birth date month is later than currentDate's date month, adjust the years and months
    if (ageMonths < 0 || (ageMonths === 0 && ageDays < 0)) {
        ageYears--;
        ageMonths += 12;
    }

    // If the birth date day is later than currentDate's date day, adjust the days and months
    if (ageDays < 0) {
        const daysInLastMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0
        ).getDate();
        ageDays += daysInLastMonth;
        ageMonths--;
    }

    years.textContent = ageYears;
    months.textContent = ageMonths;
    days.textContent = ageDays;
};

form.addEventListener('submit', validateForm);
