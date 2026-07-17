#!/bin/bash
set -e

BACKUP_DIR="backup-before-cleanup"
mkdir -p "$BACKUP_DIR/src/context"
mkdir -p "$BACKUP_DIR/src/lib/actions"
mkdir -p "$BACKUP_DIR/src/components/home"

echo "Copying context files..."
cp src/context/AuthContext.tsx "$BACKUP_DIR/src/context/"
cp src/context/CartContext.tsx "$BACKUP_DIR/src/context/"

echo "Copying lib files..."
cp src/lib/chat-cache.ts "$BACKUP_DIR/src/lib/"

echo "Copying components..."
cp -r src/components/dashboard "$BACKUP_DIR/src/components/"
cp -r src/components/therapist "$BACKUP_DIR/src/components/"
cp -r src/components/shop "$BACKUP_DIR/src/components/"
cp src/components/home/WellnessCoursesSection.tsx "$BACKUP_DIR/src/components/home/"
cp src/components/home/TherapistsSection.tsx "$BACKUP_DIR/src/components/home/"

echo "Copying action files..."
cp src/lib/actions/messages.ts "$BACKUP_DIR/src/lib/actions/"
cp src/lib/actions/courses.ts "$BACKUP_DIR/src/lib/actions/"
cp src/lib/actions/products.ts "$BACKUP_DIR/src/lib/actions/"
cp src/lib/actions/orders.ts "$BACKUP_DIR/src/lib/actions/"
cp src/lib/actions/wellbeing.ts "$BACKUP_DIR/src/lib/actions/"
cp src/lib/actions/documents.ts "$BACKUP_DIR/src/lib/actions/"
cp src/lib/actions/user.ts "$BACKUP_DIR/src/lib/actions/"
cp src/lib/actions/sessions.ts "$BACKUP_DIR/src/lib/actions/"

echo "Backup completed successfully!"
