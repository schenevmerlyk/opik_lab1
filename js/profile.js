const user = JSON.parse(sessionStorage.getItem('currentUser'));
if (user) {
    document.getElementById('profileName').innerText = user.name;
    document.getElementById('profileEmail').innerText = user.email;
    document.getElementById('profileGender').innerText = user.gender;
    document.getElementById('profileDob').innerText = user.dob;
} else {
    window.location.href = 'login.html';
}