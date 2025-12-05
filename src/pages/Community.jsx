import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Bookmark,
  TrendingUp,
  Camera,
  Dumbbell,
  Utensils,
  Users,
  Award,
  Bot
} from 'lucide-react';
import '../styles/Community.css';

const Community = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  // 카테고리 데이터
  const categories = [
    { id: 'all', label: '전체', icon: null },
    { id: 'workout', label: '운동 인증', icon: <Camera size={16} /> },
    { id: 'routine', label: '루틴 공유', icon: <Dumbbell size={16} /> },
    { id: 'diet', label: '식단', icon: <Utensils size={16} /> },
    { id: 'qna', label: '질문', icon: <MessageCircle size={16} /> },
    { id: 'free', label: '자유', icon: <Users size={16} /> }
  ];

  // 피드 데이터 (다양한 카드 타입)
  const posts = [
    {
      id: 1,
      type: 'workout',
      user: {
        name: "운동하는개발자",
        username: "fit_developer",
        avatar: null
      },
      title: "오운완! 🔥",
      content: "오늘도 하체 데이 완료했습니다. 스쿼트 5세트 데드리프트 3세트!",
      image: "https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Workout",
      likes: 124,
      comments: 18,
      category: "운동 인증"
    },
    {
      id: 2,
      type: 'diet',
      user: {
        name: "헬시푸드",
        username: "healthy_food",
        avatar: null
      },
      title: "다이어트 식단 추천",
      content: "저칼로리 고단백 닭가슴살 샐러드 레시피 공유합니다!",
      image: "https://via.placeholder.com/400x500/ec4899/ffffff?text=Diet",
      likes: 89,
      comments: 12,
      category: "식단"
    },
    {
      id: 3,
      type: 'qna',
      user: {
        name: "초보헬린이",
        username: "beginner_gym",
        avatar: null
      },
      title: "초보자 루틴 질문입니다",
      content: "헬스 시작한지 2주차인데요, 어떤 순서로 운동하는게 좋을까요?",
      image: null,
      likes: 45,
      comments: 28,
      category: "질문"
    },
    {
      id: 4,
      type: 'routine',
      user: {
        name: "PT트레이너",
        username: "pt_trainer",
        avatar: null
      },
      title: "상체 루틴 공유",
      content: "가슴+삼두 루틴입니다. 초중급자 추천드려요!",
      image: "https://via.placeholder.com/400x400/a78bfa/ffffff?text=Routine",
      likes: 203,
      comments: 34,
      category: "루틴 공유"
    },
    {
      id: 5,
      type: 'free',
      user: {
        name: "운동러버",
        username: "workout_lover",
        avatar: null
      },
      title: "운동 3개월 변화",
      content: "꾸준히 하니까 정말 달라지네요! 여러분도 포기하지 마세요!",
      image: "https://via.placeholder.com/400x600/f472b6/ffffff?text=Progress",
      likes: 567,
      comments: 89,
      category: "자유"
    },
    {
      id: 6,
      type: 'workout',
      user: {
        name: "아침운동",
        username: "morning_workout",
        avatar: null
      },
      title: "새벽 러닝 완료",
      content: "오늘 10km 달렸어요! 날씨 좋아서 기분 최고 🏃‍♂️",
      image: "https://via.placeholder.com/400x350/60a5fa/ffffff?text=Running",
      likes: 156,
      comments: 23,
      category: "운동 인증"
    }
  ];

  // 랭킹 데이터
  const rankings = [
    { rank: 1, username: "@exercise_fun", points: 2840 },
    { rank: 2, username: "@strong_man", points: 2456 },
    { rank: 3, username: "@keep_fit", points: 2103 }
  ];

  // 인기 질문
  const popularQuestions = [
    "오늘 운동 어떻게 하셨나요?",
    "추천하는 보충제 있으신가요?"
  ];

  const handleLike = (postId) => {
    console.log('Like post:', postId);
  };

  return (
    <div className="community-dashboard">
      {/* Left Sidebar - Filters */}
      <aside className="community-sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-title">피드</h3>
          <div className="category-list">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.icon && <span className="category-icon">{category.icon}</span>}
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">챌린지 중</h3>
          <div className="challenge-card">
            <div className="challenge-badge">
              <Award className="challenge-icon" size={24} />
            </div>
            <div className="challenge-info">
              <p className="challenge-name">30일 스쿼트 챌린지</p>
              <div className="challenge-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '60%'}}></div>
                </div>
                <span className="progress-text">18/30일</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Feed - Pinterest Style Grid */}
      <main className="community-main">
        <div className="feed-header">
          <h2 className="feed-title">커뮤니티</h2>
          <button className="btn-create-post">
            <Camera size={18} />
            게시글 작성
          </button>
        </div>

        <div className="masonry-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card-pinterest">
              {post.image && (
                <div className="card-image">
                  <img src={post.image} alt={post.title} />
                  <div className="category-badge">{post.category}</div>
                </div>
              )}
              
              <div className="card-content">
                <div className="card-user">
                  <div className="user-avatar-small">
                    {post.user.avatar ? (
                      <img src={post.user.avatar} alt={post.user.name} />
                    ) : (
                      <span>{post.user.name[0]}</span>
                    )}
                  </div>
                  <span className="user-name-small">{post.user.name}</span>
                </div>

                <h3 className="card-title">{post.title}</h3>
                <p className="card-text">{post.content}</p>

                <div className="card-actions">
                  <button className="card-action-btn">
                    <Heart size={16} />
                    <span>{post.likes}</span>
                  </button>
                  <button className="card-action-btn">
                    <MessageCircle size={16} />
                    <span>{post.comments}</span>
                  </button>
                  <button className="card-action-btn ml-auto">
                    <Bookmark size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar - Rankings & Popular */}
      <aside className="community-right-sidebar">
        <div className="sidebar-section">
          <div className="section-header">
            <h3 className="sidebar-title">AI 루틴 구매</h3>
            <Bot size={18} className="ai-icon" />
          </div>
          <div className="ai-suggestion-card">
            <p className="ai-suggestion-text">오늘 자세 운동은 복아이에게</p>
            <button className="btn-ai">AI 추천받기</button>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">랭킹</h3>
          <div className="ranking-list">
            {rankings.map(item => (
              <div key={item.rank} className="ranking-item">
                <span className={`rank-number ${item.rank <= 3 ? 'top-rank' : ''}`}>
                  {item.rank}
                </span>
                <div className="ranking-user">
                  <div className="ranking-avatar">
                    {item.username[1]}
                  </div>
                  <span className="ranking-username">{item.username}</span>
                </div>
                <span className="ranking-points">{item.points}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">질문 핀 스등</h3>
          <div className="popular-questions">
            {popularQuestions.map((question, index) => (
              <div key={index} className="question-item">
                <TrendingUp size={14} className="question-icon" />
                <p className="question-text">{question}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">검김</h3>
          <div className="search-ranking">
            {rankings.map(item => (
              <div key={item.rank} className="search-item">
                <span className="search-rank">{item.rank}</span>
                <span className="search-username">{item.username}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Community;