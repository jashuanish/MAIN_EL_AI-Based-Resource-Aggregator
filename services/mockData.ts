import { LearningResource, ConceptNode, UserStats } from '../types';

export const MOCK_RESOURCES: LearningResource[] = [
  {
    id: '1',
    title: 'Neural Networks from Scratch',
    source: 'YouTube / 3Blue1Brown',
    type: 'video',
    qualityScore: 5.0,
    duration: '18 min',
    difficulty: 'Intermediate',
    summary: [
      'Visual introduction to the math behind neural networks',
      'Explains backpropagation with calculus visualization',
      'Deep dive into gradient descent mechanics'
    ],
    url: '#',
    views: '2.4M',
    date: '1 year ago',
    tags: ['AI', 'Math', 'Visual']
  },
  {
    id: '2',
    title: 'Attention Is All You Need',
    source: 'Research PDF / Arxiv',
    type: 'pdf',
    qualityScore: 4.8,
    duration: '45 min read',
    difficulty: 'Advanced',
    summary: [
      'Seminal paper introducing the Transformer architecture',
      'Replaces RNNs with self-attention mechanisms',
      'Basis for GPT and BERT models'
    ],
    url: '#',
    date: '2017',
    tags: ['NLP', 'Research', 'Transformers']
  },
  {
    id: '3',
    title: 'React 18 Concurrency Guide',
    source: 'React Blog',
    type: 'article',
    qualityScore: 4.6,
    duration: '12 min read',
    difficulty: 'Intermediate',
    summary: [
      'Overview of concurrent rendering features',
      'How transitions improve UI responsiveness',
      'Using Suspense for data fetching'
    ],
    url: '#',
    views: '150k',
    date: '6 months ago',
    tags: ['Frontend', 'Web', 'React']
  }
];

// Helper to generate dynamic resources based on a topic string
// This simulates the AI finding resources when the API is not available or for demo purposes
export const generateSimulatedResources = (topic: string): LearningResource[] => {
  const t = topic.charAt(0).toUpperCase() + topic.slice(1);
  return [
    {
      id: `gen-${Date.now()}-1`,
      title: `Introduction to ${t}: A Comprehensive Guide`,
      source: 'YouTube / CrashCourse',
      type: 'video',
      qualityScore: 4.8,
      duration: '12 min',
      difficulty: 'Beginner',
      summary: [`Core concepts of ${t} explained`, 'Real-world examples and applications', 'Historical context and future outlook'],
      url: '#',
      views: '850k',
      date: '1 year ago',
      tags: [t, 'Education', 'Basics']
    },
    {
      id: `gen-${Date.now()}-2`,
      title: `Advanced ${t} Techniques and Best Practices`,
      source: 'Medium / TechDaily',
      type: 'article',
      qualityScore: 4.5,
      duration: '8 min read',
      difficulty: 'Advanced',
      summary: [`Deep dive into complex ${t} methodologies`, 'Optimization strategies', 'Expert tips for professionals'],
      url: '#',
      views: '12k',
      date: '3 weeks ago',
      tags: [t, 'Advanced', 'Guide']
    },
    {
      id: `gen-${Date.now()}-3`,
      title: `Research Paper: The Future of ${t}`,
      source: 'University Research PDF',
      type: 'pdf',
      qualityScore: 4.9,
      duration: '35 min read',
      difficulty: 'Intermediate',
      summary: [`Academic analysis of ${t} trends`, 'Statistical data and case studies', 'Peer-reviewed findings'],
      url: '#',
      date: '2023',
      tags: [t, 'Research', 'Academic']
    },
    {
      id: `gen-${Date.now()}-4`,
      title: `${t} in 100 Seconds`,
      source: 'YouTube / Fireship',
      type: 'video',
      qualityScore: 4.7,
      duration: '2 min',
      difficulty: 'Beginner',
      summary: ['Rapid-fire overview', 'Key syntax/concepts', 'Quick start guide'],
      url: '#',
      views: '1.5M',
      date: '5 months ago',
      tags: [t, 'Quick', 'Overview']
    },
    {
      id: `gen-${Date.now()}-5`,
      title: `Mastering ${t}: Full Course`,
      source: 'FreeCodeCamp',
      type: 'video',
      qualityScore: 4.9,
      duration: '4 hours',
      difficulty: 'Intermediate',
      summary: ['Complete curriculum', 'Hands-on projects', 'Certification preparation'],
      url: '#',
      views: '3.2M',
      date: '2 years ago',
      tags: [t, 'Course', 'Full']
    },
    {
      id: `gen-${Date.now()}-6`,
      title: `Critical Analysis of ${t} Theory`,
      source: 'Academic Journal',
      type: 'article',
      qualityScore: 4.4,
      duration: '15 min read',
      difficulty: 'Advanced',
      summary: ['Theoretical framework critique', 'Alternative perspectives', 'Modern debate summary'],
      url: '#',
      views: '5k',
      date: '1 month ago',
      tags: [t, 'Theory', 'Analysis']
    }
  ];
};

export const MOCK_CONCEPT_MAP: ConceptNode = {
  id: 'root',
  label: 'Machine Learning',
  isExpanded: true,
  children: [
    {
      id: 'sl',
      label: 'Supervised Learning',
      children: [
        { id: 'reg', label: 'Regression' },
        { id: 'cls', label: 'Classification' }
      ]
    },
    {
      id: 'ul',
      label: 'Unsupervised Learning',
      children: [
        { id: 'clust', label: 'Clustering' },
        { id: 'dim', label: 'Dimensionality Reduction' }
      ]
    },
    {
      id: 'dl',
      label: 'Deep Learning',
      isExpanded: true,
      children: [
        { id: 'cnn', label: 'CNNs (Vision)' },
        { id: 'rnn', label: 'RNNs (Sequence)' },
        { id: 'trans', label: 'Transformers' }
      ]
    }
  ]
};

export const USER_STATS: UserStats = {
  topicsCompleted: 14,
  streakDays: 5,
  totalHours: 42.5,
  resourceCompletion: 68,
  weeklyActivity: [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.0 },
    { day: 'Wed', hours: 3.5 },
    { day: 'Thu', hours: 0.5 },
    { day: 'Fri', hours: 4.0 },
    { day: 'Sat', hours: 1.5 },
    { day: 'Sun', hours: 2.0 },
  ]
};
