💻 Cyberpunk Control Panel: Challenge de Décryptage de Logs (Épreuve 6)

🌟 Objectif de l'Épreuve
L'objectif de cette épreuve est de restaurer la stabilité du réseau dorsal en identifiant, décryptant et validant le flag caché dans les logs système corrompus.

L'interface simule un panneau de contrôle sophistiqué où les logs sont chiffrés à l'aide de méthodes simples (ROT13, INVERSION). L'utilisateur doit utiliser les indices fournis par les outils d'analyse corrompus pour effectuer le décryptage manuellement.

🚀 Démarrage du ProjetPrérequis
Ce projet est basé sur Node.js et Express pour simuler l'API des logs.Node.js (version récente)

Installation et Lancement
1. Assurez-vous d'avoir installé toutes les dépendances (dans un environnement réel, cela inclurait npm install express).
2. Lancez le serveur :
----------------------
| Bash               |
----------------------
| node server.js     |
----------------------
3. Ouvrez l'application dans votre navigateur à l'adresse indiquée dans la console (généralement : http://localhost:4000/index.html).

🔧 Structure des FichiersFichierRôleDescription
index.html            Structure HTML      Contient la structure du Panneau de Contrôle, 
                                          l'interface à 3 colonnes pour les logs, et la 
                                          section de validation du flag.

style.css             Styling             Fournit les styles Cyberpunk, l'effet Néon sur le 
                                          panneau principal, et l'animation de fond "Matrix".

script.js             Logique Frontend    Gère le chargement de l'API des logs, l'affichage du 
                                          contenu chiffré, la navigation entre les sections, 
                                          les indices de décryptage (simulés) et la validation 
                                          du flag (voir solution).

server.js             API Backend         Simule une API (/api/logs) qui génère et sert les 
                      (Node/Express)      logs en clair, puis les chiffre (ROT13 ou INVERSION) 
                                          avant de les envoyer au client. Contient la source 
                                          du flag.
                     

🔐 Solution du Challenge (Flag)
1. Méthode de Décryptage
L'analyse de server.js révèle que le flag est contenu dans le Log ID 3 et est chiffré en ROT13.

Le ROT13 est un chiffrement de César avec un décalage de 13 positions. Il est auto-réciproque, ce qui signifie qu'appliquer ROT13 deux fois vous donne le message original.

3. Le FlagEn décryptant manuellement (ou en utilisant la fonction rot13Encrypt pour vérifier) le contenu chiffré du Log ID 3, on obtient :
Élément                Valeur
Log ID critique        3 (Type : RÉSEAU)
Méthode requise        ROT13
Flag à valider         FLAG-LOGS-DECRYPT-6
