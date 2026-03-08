# Déploiement Traingame

Ce guide fournit une base **dev** et **prod-like** avec Docker Compose, migrations au démarrage, reverse proxy TLS, CI/CD, healthchecks et rollback minimal.

## 1) Prérequis

- Docker 24+
- Docker Compose v2
- Un gestionnaire de secrets (recommandé: Doppler, 1Password Secrets Automation, AWS/GCP/Azure Secret Manager)
- Domaine DNS pointant vers votre hôte (prod)

## 2) Variables d'environnement sécurisées

> Ne jamais commiter `.env` réel. Utiliser `.env.example` comme référence uniquement.

### Option A — Doppler (recommandée)

```bash
# Installer Doppler CLI
curl -Ls https://cli.doppler.com/install.sh | sh

# Associer le projet
cd /workspace/traingame
doppler setup

# Injecter les secrets et démarrer en prod-like
doppler run -- docker compose --profile prod up -d --build
```

### Option B — Secret manager cloud + CI OIDC

Stocker: `DATABASE_URL`, `POSTGRES_PASSWORD`, `JWT_SECRET`, `SESSION_SECRET`, `DOMAIN` dans votre secret manager.
Dans GitHub Actions, récupérer ces secrets à runtime (OIDC) et les injecter comme variables d'environnement de job.

## 3) Lancement local dev

```bash
cp .env.example .env
# adapter les valeurs dev

docker compose --profile dev up -d --build
# app: http://localhost:8080
# api health: http://localhost:8080/health
# api ready:  http://localhost:8080/ready
```

## 4) Lancement prod-like (TLS auto avec Caddy)

```bash
export DOMAIN=app.example.com
# injecter secrets via secret manager (ex: Doppler)
docker compose --profile prod up -d --build
```

Caddy termine TLS automatiquement (Let's Encrypt) sur `:443`.

## 5) Migrations DB au démarrage

Le conteneur `server` exécute `npm run db:migrate` via `server/scripts/entrypoint.sh` avant le démarrage applicatif.

Commande de dry-run (à intégrer en QA/CD):

```bash
cd server
npm run db:migrate:status
```

## 6) Pipeline CI/CD

Workflow: `.github/workflows/ci-cd.yml`

### Étapes CI

1. Build image server
2. Build image client
3. Tests backend (`npm test --if-present`)
4. Dry-run migrations (`npm run db:migrate:status --if-present`)

### Étapes CD

Sur `main`, push des images vers GHCR puis déploiement selon `deploy_target`:
- `railway`
- `flyio`
- `render`
- `vps`

Exécution manuelle:

```bash
gh workflow run ci-cd.yml -f deploy_target=vps
```

## 7) Healthchecks et rollback basique

- API expose `/health` (liveness) et `/ready` (readiness)
- `scripts/deploy_vps.sh`:
  - déploie la nouvelle version
  - vérifie `/ready`
  - rollback minimal vers image précédente en cas d'échec

## 8) Backups DB (stratégie recommandée)

### Fréquence
- Full backup quotidien
- WAL/binlog continu si disponible (PITR)
- Rétention: 7 daily + 4 weekly + 6 monthly

### Commandes exactes (PostgreSQL)

Backup logique:

```bash
docker compose exec -T db pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > backup_$(date +%F_%H%M).dump
```

Restauration:

```bash
cat backup_2026-01-01_0100.dump | docker compose exec -T db pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists
```

Vérification automatique (exemple cron):

```bash
0 2 * * * cd /srv/traingame && docker compose exec -T db pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > /srv/backups/traingame_$(date +\%F_\%H\%M).dump
```

## 9) Vérifications post-déploiement

```bash
curl -f https://app.example.com/health
curl -f https://app.example.com/ready
docker compose ps
docker compose logs --tail=200 server
```
