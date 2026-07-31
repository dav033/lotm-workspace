-- El castellano permanece en los campos históricos; las columnas inglesas
-- son opcionales para permitir desplegar el esquema antes de completar el
-- catálogo. La aplicación usa castellano como respaldo durante la transición.
ALTER TABLE "Element"
  ADD COLUMN "nameEn" TEXT,
  ADD COLUMN "descriptionEn" TEXT,
  ADD COLUMN "revealTitleEn" TEXT,
  ADD COLUMN "revealTextEn" TEXT;

ALTER TABLE "Ritual"
  ADD COLUMN "nameEn" TEXT;
