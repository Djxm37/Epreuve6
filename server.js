// Fichier : server.js (Version Corrigée et Robuste pour Node.js)

const express = require('express');
const app = express();
const port = 4000;

// --- Configuration du Middleware ---
// 1. Sert les fichiers statiques (index.html, style.css, script.js)
// __dirname est le chemin absolu du dossier où se trouve server.js
app.use(express.static(__dirname)); 
// 2. Permet de lire les corps de requêtes JSON (non utilisé ici, mais bonne pratique)
app.use(express.json()); 

// --- Fonctions de Chiffrement (JavaScript) ---

// 1. ROT13 (Le flag est ici)
function rot13Encrypt(text) {
    // La méthode par expression régulière et code de caractère est parfaitement fonctionnelle.
    return text.replace(/[a-zA-Z]/g, function(c) {
        return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
}

// 2. Chiffrement par Inversion
function reverseEncrypt(text) {
    return text.split('').reverse().join('');
}


// --- Données Source (Logs en clair) ---
const logsEnClair = [
    {
        "id": 1, 
        "timestamp": "2025-12-06T10:42:00Z",
        "type": "SECURITÉ",
        "content": "Tentative d'injection SQL sur l'interface de connexion depuis une IP douteuse.",
        "method": "ROT13"
    },
    {
        "id": 2,
        "timestamp": "2025-12-06T10:45:30Z",
        "type": "ACCÈS",
        "content": "Connexion de l'utilisateur 'admin_sec' depuis une adresse suspecte. Clé non valide.",
        "method": "ROT13" 
    },
    {
        "id": 3,
        "timestamp": "2025-12-06T10:49:15Z",
        "type": "RÉSEAU", 
        // Log critique contenant le flag (Chiffrement cible : ROT13)
        "content": "Instabilité critique détectée sur le réseau dorsal. L.U.M.E.N. a provoqué une saturation du trafic. Le flag est : FLAG-LOGS-DECRYPT-6. Rétablir le protocole BGP.", 
        "method": "ROT13" 
    },
    {
        "id": 4,
        "timestamp": "2025-12-06T10:55:01Z",
        "type": "SYSTÈME",
        "content": "Surcharge CPU sur le serveur de logs. Le service Apache a été redémarré avec succès.",
        "method": "INVERSION"
    },
    {
        "id": 5,
        "timestamp": "2025-12-06T11:01:22Z",
        "type": "ACCÈS",
        "content": "Tentative d'escalade de privilèges via un script shell inconnu sur le port 22.",
        "method": "ROT13"
    },
    {
        "id": 6,
        "timestamp": "2025-12-06T11:05:45Z",
        "type": "SÉCURITÉ",
        "content": "Alerte : Signature de virus inconnue trouvée dans le répertoire temporaire de l'utilisateur.",
        "method": "ROT13" 
    },
    {
        "id": 7,
        "timestamp": "2025-12-06T11:12:10Z",
        "type": "SYSTÈME",
        "content": "Arrêt inattendu du moniteur de base de données. Processus relancé automatiquement.",
        "method": "INVERSION"
    },
    {
        "id": 8,
        "timestamp": "2025-12-06T11:15:55Z",
        "type": "RÉSEAU", 
        "content": "Anomalie de routage détectée. Le flux de données est détourné vers un serveur externe suspect.",
        "method": "ROT13"
    },
];


// --- ROUTE API : /api/logs ---
app.get('/api/logs', (req, res) => {
    
    const logsCryptes = logsEnClair.map(log => {
        let encryptedContent = log.content;

        switch (log.method) {
            case 'ROT13':
                encryptedContent = rot13Encrypt(log.content);
                break;
            case 'INVERSION':
                encryptedContent = reverseEncrypt(log.content);
                break;
            default:
                encryptedContent = log.content; 
        }

        return {
            id: log.id,
            timestamp: log.timestamp,
            type: log.type,
            encrypted_content: encryptedContent,
        };
    });

    res.json(logsCryptes);
});

// --- Démarrage du Serveur ---
app.listen(port, () => {
    console.log(`Serveur Node.js démarré sur http://localhost:${port}`);
    console.log(`Accédez à l'interface via : http://localhost:${port}/index.html`);
});
