import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Grid } from 'lucide-react';
import '../styles/CommunityProfile.css';

const CommunityProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  
  const [activeTab, setActiveTab] = useState('posts');
  
  // 더미 사용자 데이터
  const user = {
    name: "데모 유저",
    username: "demo_user",
    bio: "안녕하세요! 👋",
    avatar: null,
    postsCount: 1,
    followersCount: 1,
    followingCount: 1,
    isFollowing: false
  };

  // 더미 포스트 데이터
  const userPosts = [
    {
      id: 1,
      image: "https://via.placeholder.com/300x300/333/666?text=Post+1",
      likes: 1,
      comments: 1
    }
  ];

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <button className="back-btn" onClick={() => navigate('/community')}>
          <ArrowLeft size={20} />
        </button>
        <div className="profile-header-info">
          <h1 className="profile-header-name">{user.name}</h1>
          <p className="profile-header-posts">{user.postsCount} 게시물</p>
        </div>
      </header>

      {/* Profile Info */}
      <div className="profile-info-section">
        <div className="profile-avatar-large">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <span>{user.name[0]}</span>
          )}
        </div>

        <div className="profile-details">
          <div className="profile-name-section">
            <h2 className="profile-name">{user.name}</h2>
            <button className="follow-btn">
              {user.isFollowing ? '언팔로우' : '팔로우'}
            </button>
          </div>

          <p className="profile-username">@{user.username}</p>
          
          {user.bio && <p className="profile-bio">{user.bio}</p>}

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{user.postsCount}</span>
              <span className="stat-label">게시물</span>
            </div>
            <div className="stat-item" onClick={() => setActiveTab('followers')}>
              <span className="stat-value">{user.followersCount}</span>
              <span className="stat-label">팔로워</span>
            </div>
            <div className="stat-item" onClick={() => setActiveTab('following')}>
              <span className="stat-value">{user.followingCount}</span>
              <span className="stat-label">팔로잉</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <Grid size={16} />
          게시물
        </button>
        <button 
          className={`tab-btn ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => setActiveTab('followers')}
        >
          팔로워
        </button>
        <button 
          className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          팔로잉
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'posts' && (
          <div className="posts-grid">
            {userPosts.map(post => (
              <div key={post.id} className="grid-post">
                <img src={post.image} alt="Post" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'followers' && (
          <div className="followers-list">
            <p className="empty-message">팔로워가 없습니다</p>
          </div>
        )}

        {activeTab === 'following' && (
          <div className="following-list">
            <p className="empty-message">팔로잉하는 사용자가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityProfile;