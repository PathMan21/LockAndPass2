function checkSession() {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');
    
    if (!token || !loginTime || (Date.now() - loginTime > 10 * 60 * 1000)) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('loginTime');
      window.location.href = '../index.html';
      return false;
    } else {
      setTimeout(() => {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');
        window.location.href = '../index.html';
      }, 10 * 60 * 1000 - (Date.now() - loginTime));
      return true;
    }
  }
  
  module.exports = checkSession;
  