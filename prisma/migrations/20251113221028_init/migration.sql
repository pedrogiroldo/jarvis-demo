-- CreateTable
CREATE TABLE "Chef" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Chef_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "driver_pkey" PRIMARY KEY ("id")
);
