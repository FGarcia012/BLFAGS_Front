export const validateName = (name) => {
    if (!name || typeof name !== 'string') {
        return false;
    }

    const trimmedName = name.trim();
    
    if (trimmedName.length < 2 || trimmedName.length > 50) {
        return false;
    }
    
    const regex = /^[A-Za-zÁ-ÿ\u00f1\u00d1]([A-Za-zÁ-ÿ\u00f1\u00d1\s'-]*[A-Za-zÁ-ÿ\u00f1\u00d1])?$/;
    
    if (trimmedName.includes('  ')) {
        return false;
    }
    
    return regex.test(trimmedName);
}

export const validateNameMessage = 'El nombre debe tener entre 2 y 50 caracteres, solo letras, espacios, guiones y apostrofes';
