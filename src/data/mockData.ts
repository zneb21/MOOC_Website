import tourismImage from "@/assets/course-tourism.jpg";
import cookingImage from "@/assets/course-cooking.jpg";
import agricultureImage from "@/assets/course-agriculture.jpg";
import craftsImage from "@/assets/course-crafts.jpg";

// CHANGE: Replace with database query: database.from('enrollments').select('*, courses(*)').eq('user_id', userId)
export interface Enrollment {
  id: string;
  courseId: number;
  title: string;
  instructor: string;
  image: string;
  progress: number;
  lastAccessed: string;
  category: string;
}

export const mockEnrollments: Enrollment[] = [
  {
    id: "1",
    courseId: 1,
    title: "Discover Iloilo: A Complete Tourism Guide",
    instructor: "Maria Santos",
    image: tourismImage,
    progress: 45,
    lastAccessed: "2024-01-15",
    category: "Tourism",
  },
  {
    id: "2",
    courseId: 2,
    title: "Traditional Filipino Cuisine Masterclass",
    instructor: "Chef Ramon Cruz",
    image: cookingImage,
    progress: 80,
    lastAccessed: "2024-01-14",
    category: "Cooking",
  },
  {
    id: "3",
    courseId: 3,
    title: "Hablon Weaving: Traditional Ilonggo Crafts",
    instructor: "Lola Teodora",
    image: craftsImage,
    progress: 100,
    lastAccessed: "2024-01-10",
    category: "Crafts",
  },
];

// Empty state for testing - you can switch between mockEnrollments and emptyEnrollments
export const emptyEnrollments: Enrollment[] = [];
