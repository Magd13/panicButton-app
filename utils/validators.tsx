
export const validateCedula = (cedula: string): boolean => {
    if (!/^\d{10}$/.test(cedula)) return false;
  
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const provincia = parseInt(cedula.substring(0, 2));
    if (provincia < 1 || provincia > 24) return false;
  
    const tercerDigito = parseInt(cedula.charAt(2));
    if (tercerDigito > 6) return false;
  
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let valor = parseInt(cedula.charAt(i)) * coeficientes[i];
      if (valor > 9) valor -= 9;
      suma += valor;
    }
  
    const ultimoDigito = parseInt(cedula.charAt(9));
    const digitoVerificador = (10 - (suma % 10)) % 10;
  
    return ultimoDigito === digitoVerificador;
  };

  export  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
    return passwordRegex.test(password);
  };

  export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  