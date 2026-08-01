# 🚀 API REST DevOps en Producción - Express & PostgreSQL

**Proyecto Evaluado Final: Módulo 8 (DevOps & Deployment)**  
**Estudiante:** Gustavo Palacios  
**Grupo:** Grupo 3

---

## 📋 Descripción del Proyecto
API REST construida con Node.js y Express, integrada con una base de datos PostgreSQL. Cuenta con arquitectura preparada para producción, incluyendo gestión de variables de entorno, monitoreo activo, automatización de CI/CD mediante GitHub Actions y un plan detallado de respaldos (backups).

---

## 🛠️ Tecnologías Utilizadas
* **Backend:** Node.js & Express
* **Base de Datos:** PostgreSQL
* **Variables de Entorno:** Dotenv (`.env.example`)
* **CI/CD:** GitHub Actions
* **Plataforma Cloud:** Render / Supabase

---

## 🔍 Monitoreo y Salud del Sistema (Health Check)
La API cuenta con un endpoint activo de monitoreo para verificar la operatividad de los servicios y la conexión a la base de datos:

* **Endpoint:** `GET /health`

---

## 📦 Plan de Respaldos y Recuperación (Backups Strategy)

### 1. Información Respaldada
Se realiza un respaldo completo (`dump`) de la base de datos PostgreSQL, incluyendo esquemas, tablas (`productos`), secuencias y registros de información.

### 2. Frecuencia de Respaldos
* **Respaldos Automáticos:** Diarios a las 02:00 AM UTC (Horario de bajo tráfico).
* **Respaldos Manuales:** Ejecutados antes de realizar migraciones o cambios estructurales en la base de datos.

### 3. Almacenamiento Seguro
Los archivos `.sql` comprimidos se almacenan en un bucket privado de **Amazon S3 / Google Cloud Storage** con cifrado de punto a punto (AES-256) y retención de 30 días.

### 4. Procedimiento de Recuperación (Disaster Recovery)
En caso de fallo de infraestructura o corrupción de datos:
1. Notificar al administrador DevOps del sistema.
2. Descargar la última copia de seguridad válida desde el almacenamiento seguro.
3. Restaurar la base de datos mediante la herramienta CLI `pg_restore`:
   ```bash
   pg_restore -h <HOST_DB> -U <USUARIO> -d <NOMBRE_DB> < BACKUP_FILE.sql