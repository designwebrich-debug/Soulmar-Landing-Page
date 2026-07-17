#!/bin/bash
set -e

echo "Deleting unused contexts..."
rm -f src/context/AuthContext.tsx
rm -f src/context/CartContext.tsx

echo "Deleting unused lib files..."
rm -f src/lib/chat-cache.ts

echo "Deleting unused components..."
rm -rf src/components/dashboard
rm -rf src/components/therapist
rm -rf src/components/shop
rm -f src/components/home/WellnessCoursesSection.tsx
rm -f src/components/home/TherapistsSection.tsx

echo "Deleting unused actions..."
rm -f src/lib/actions/messages.ts
rm -f src/lib/actions/courses.ts
rm -f src/lib/actions/products.ts
rm -f src/lib/actions/orders.ts
rm -f src/lib/actions/wellbeing.ts
rm -f src/lib/actions/documents.ts
rm -f src/lib/actions/user.ts
rm -f src/lib/actions/sessions.ts

echo "Cleanup completed successfully!"
