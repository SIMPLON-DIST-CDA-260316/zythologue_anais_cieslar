# Correction pair

## Informations générales

- **Correcteur** : Serah
- **Projet corrigé** : Maxence

## Points relevés

### Prise en main du projet

Le README est concis et clair sur la marche à suivre, mais manque de mise en forme. Il y a des éléments qui n'ont pas d'espace suffisant pour une meilleure lisibilité. Les paramètres proposés pour la connexion DBeaver n'ont pas fonctionné car le fichier `.env.example` donne d'autres informations. L'indication de créer le `.env` n'est pas donnée explicitement.

### Fichiers SQL et seeds

Il semble y avoir un problème avec les UUID. D'après Claude, un UUID valide suit le format `8-4-4-4-12` en hexadécimal uniquement (chiffres 0-9 et lettres a-f), or dans les seeds il existe des UUID avec des lettres invalides.

### Requêtes

✅ Toutes les queries fonctionnent bien.
