// Définition de la fonction handleCheatingDetected pour éviter les erreurs dans le code de sécurité
function handleCheatingDetected(method) {
    console.warn(`Tentative d'accès non autorisée détectée : ${method}. Veuillez respecter les règles de l'épreuve.`);
    // Vous pouvez ajouter ici des actions plus visibles si vous le souhaitez (ex: bloquer la page)
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configuration Log API ---
    const apiEndpoint = '/api/logs'; 
    const logsTableBody = document.getElementById('logs-table-body');
    const contentDisplay = document.getElementById('encrypted-content-display');

    // --- Configuration Validation Flag ---
    const flagInput = document.getElementById('flag-input');
    const validateButton = document.getElementById('validate-flag-btn');
    const messageDisplay = document.getElementById('validation-message');
    // Le flag doit être le même que dans server.js pour la validation
    const EXPECTED_FLAG = "FLAG-LOGS-DECRYPT-6"; 
    
    // --- Éléments de Navigation ---
    const sidebarLinks = document.querySelectorAll('#logs-sidebar a[data-target]');
    const logsSection = document.getElementById('log-decrypt-challenge');
    const validationSection = document.getElementById('flag-validation-challenge');
    const decryptionButtons = document.querySelectorAll('.decrypt-button');
    const decryptionHint = document.getElementById('decryption-hint');


    // ===================================
    // LOGIQUE 1 : CONSULTATION DES LOGS
    // ===================================

    function fetchLogs() {
        fetch(apiEndpoint)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                return response.json(); 
            })
            .then(logs => {
                displayLogsList(logs);
            })
            .catch(error => {
                console.error("Erreur de chargement de l'API des logs:", error);
                contentDisplay.textContent = `Échec de la connexion à l'API: ${error.message}. Vérifiez que le serveur Node.js est bien démarré.`;
                contentDisplay.style.color = 'var(--color-error)';
            });
    }

    function displayLogsList(logs) {
        logsTableBody.innerHTML = ''; 
        logs.forEach(log => {
            const row = logsTableBody.insertRow();
            row.dataset.logId = log.id; 
            
            row.insertCell().textContent = log.id;
            row.insertCell().textContent = log.timestamp.substring(11, 19); 
            row.insertCell().textContent = log.type;

            row.addEventListener('click', () => {
                document.querySelectorAll('#logs-table-body tr').forEach(r => r.classList.remove('selected'));
                row.classList.add('selected'); 
                displayLogContent(log);
            });
        });
    }

    function displayLogContent(log) {
        contentDisplay.textContent = log.encrypted_content;
        // Réinitialiser le message d'aide au décryptage à chaque nouveau log sélectionné
        decryptionHint.textContent = "**ATTENTION** : Le contenu est illisible à première vue. Le décryptage est manuel.";
        decryptionHint.style.color = 'var(--color-warning)';
    }


    // ===================================
    // LOGIQUE 2 : NAVIGATION SIDEBAR (Épreuve 6 <-> Épreuve 7)
    // ===================================
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            const targetId = link.getAttribute('data-target');
            
            // Masquer toutes les sections de contenu
            logsSection.style.display = 'none';
            validationSection.style.display = 'none';

            // Afficher la section cible
            if (targetId === 'log-display-area') {
                 logsSection.style.display = 'block';
            } else if (targetId === 'flag-validation-challenge') {
                 validationSection.style.display = 'block';
            }

            // Gérer la classe active
            sidebarLinks.forEach(l => l.classList.remove('active-link'));
            link.classList.add('active-link');
        });
    });


    // ===================================
    // LOGIQUE 3 : OUTILS DE DÉCRYPTAGE (Indices ROT13 / INVERSION)
    // ===================================
    decryptionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const method = button.getAttribute('data-method');
            
            if (contentDisplay.textContent.startsWith('Sélectionnez')) {
                decryptionHint.innerHTML = "❌ **ERREUR** : Sélectionnez d'abord un log dans la liste centrale.";
                decryptionHint.style.color = 'var(--color-error)';
                return;
            }

            if (method === 'rot') {
                // ROT13 : Indice de succès avec explication et exemple
                decryptionHint.innerHTML = `
                    ✅ **ANALYSE ROT** : C'est la bonne méthode !<br>
                    **Explication Rot13** : Ce chiffrement de César utilise un décalage de **13 positions**. Le chiffrement est son propre déchiffrement (Rot13(Rot13(X)) = X).<br><br>
                    **Alphabet de Décalage (A ↔ N)** :<br>
                    A B C D E F G H I J K L M<br>
                    N O P Q R S T U V W X Y Z<br>
                    **Exemple** : 'BONJOUR' devient 'B' + 13 = 'O', 'O' + 13 = 'B'. Ainsi, la séquence de ROT13 sur **BONJOUR** donne **O B A W B H E** (simulé).<br><br>
                    L'outil est corrompu et ne peut pas afficher le résultat final. **Décryptez manuellement !**
                `;
                decryptionHint.style.color = 'var(--color-success)';

            }   else if (method === 'inversion') {
                // INVERSION : Indice de succès simulé avec explication et exemple
                decryptionHint.innerHTML = `
                    ✅ **ANALYSE INVERSION** : C'est la bonne méthode !<br>
                    **Explication Inversion (Miroir)** : Cette méthode inverse l'ordre des caractères du message. C'est une transposition très simple.<br><br>
                    **Exemple** : Le mot 'CODE' devient 'EDOC'.<br>
                    Notre message chiffré a été mélangé et **n'est pas de l'inversion pure**. Échec de l'outil.<br>
                    **Décryptez manuellement !**
                `;
                decryptionHint.style.color = 'var(--color-success)';

            }
        });
    });


    // ===================================
    // LOGIQUE 4 : VALIDATION DU FLAG
    // ===================================
    validateButton.addEventListener('click', () => {
        const enteredFlag = flagInput.value.trim().toUpperCase(); 

        messageDisplay.className = '';

        if (enteredFlag === EXPECTED_FLAG) {
            // Succès
            messageDisplay.classList.add('success');
            messageDisplay.innerHTML = '✅ **FLAG ACCEPTÉ !** Outils de restauration réseau déverrouillés. Vous pouvez passer à l\'Épreuve 7.';
            
            validateButton.disabled = true;
            flagInput.disabled = true;

        } else {
            // Erreur
            messageDisplay.classList.add('error');
            messageDisplay.textContent = '❌ Flag incorrect. Vérifiez attentivement votre décryptage.';
        }
    });
    
    // --- DÉMARRAGE DE L'APPLICATION ---
    logsSection.style.display = 'block'; // Afficher la section des logs au début
    fetchLogs();


    // ===================================
    // LOGIQUE 5 : DÉSACTIVATION DE L'INSPECTION
    // ===================================

    // 1. Désactiver le Clic Droit
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        handleCheatingDetected('Clic Droit');
    });

    // 2. Désactiver les Raccourcis Clavier courants (F12, Ctrl/Cmd + Shift + I, Ctrl/Cmd + U)
    document.addEventListener('keydown', (e) => {
        
        // F12
        if (e.keyCode === 123) { 
            e.preventDefault();
            console.log("Accès refusé. Inspection bloquée (F12).");
            handleCheatingDetected('F12');
            return;
        }
        // Ctrl + Shift + I (ou Cmd + Option + I sur Mac) pour ouvrir DevTools
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) { 
            e.preventDefault();
            console.log("Accès refusé. Inspection bloquée (Ctrl+Shift+I).");
            handleCheatingDetected('Ctrl+Shift+I');
            return;
        }
        // Ctrl + U (ou Cmd + U sur Mac) pour voir le code source
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            console.log("Accès refusé. Affichage du code source bloqué (Ctrl+U).");
            handleCheatingDetected('Ctrl+U');
            return;
        }
        // Cmd + Option + J (Mac)
        if (e.metaKey && e.altKey && e.keyCode === 74) {
            e.preventDefault();
            console.log("Accès refusé. Inspection bloquée (Cmd+Option+J).");
            handleCheatingDetected('Cmd+Option+J');
            return;
        }
    });

    // ===================================
    // LOGIQUE 6 : ANIMATION MATRIX
    // ===================================
    const bg = document.getElementById('matrix-bg');
    // Calcule le nombre de colonnes de chiffres nécessaire
    const columnsCount = Math.floor(window.innerWidth / 20); 

    // Fonction pour générer et insérer une colonne de chiffres aléatoires
    function createMatrixColumn(index) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        
        // Position X de la colonne
        column.style.left = `${index * 20}px`;
        
        // Décalage de l'animation pour un effet de pluie non uniforme
        column.style.animationDelay = `-${Math.random() * 5}s`;
        
        // Vitesse d'animation aléatoire (entre 5s et 10s)
        column.style.animationDuration = `${Math.random() * 5 + 5}s`;

        // Contenu : une chaîne de chiffres/symboles
        const characters = '0123456789!@#$%^&*()_+-=~`[]{}|:;"<>,.?/';
        let content = '';
        for (let i = 0; i < 30; i++) { 
            content += characters[Math.floor(Math.random() * characters.length)] + '<br>';
        }
        column.innerHTML = content;
        
        bg.appendChild(column);
    }

    // Création de toutes les colonnes
    for (let i = 0; i < columnsCount; i++) {
        createMatrixColumn(i);
    }
});

// NOTE: La logique serveur (server.js) reste inchangée et est nécessaire pour que l'API /api/logs fonctionne.
