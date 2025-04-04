// User Profile Data
const userProfile = {
    name: 'Meghan Rivera',
    location: 'Zeeland',
    score: 242,
    scoreChange: '+15 this week',
    badges: [
        { icon: 'fa-cookie', name: 'Cookie' },
        { icon: 'fa-ice-cream', name: 'Nice spice' },
        { icon: 'fa-glasses', name: 'Get focus' },
        { icon: 'fa-heart', name: 'Style Spy' }
    ]
};

// Sample post data
const allPosts = [
    {
        id: 1,
        author: 'Meghan Rivera',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        time: '4 hours ago',
        category: 'Beauty',
        content: 'Hi girls, can anyone suggest a product for oily skin which can be used as a primer. Thanks in advance :)',
        answers: 24,
        topAnswer: 'Try Neutrogena oil free moisturiser. It worked for me.',
        isLiked: false,
        isSaved: false
    },
    {
        id: 2,
        author: 'Anonymous',
        time: '6 days ago',
        category: 'Work',
        content: 'Friends,i need help for my project..i want to do a minor project like ticket booking or library management..have anyone done something like that and can mail me?',
        answers: 1,
        isLiked: false,
        isSaved: false
    },
    {
        id: 3,
        author: 'Meghan Rivera',
        time: '1 week ago',
        category: 'Relationships',
        content: 'How do you handle long-distance relationships? Any tips would be appreciated.',
        answers: 15,
        topAnswer: 'Communication is key. Schedule regular video calls and plan visits in advance.',
        isLiked: true,
        isSaved: true
    }
];

// DOM Elements
const postsContainer = document.querySelector('.posts-container');
const tabs = document.querySelectorAll('.tab');
const filterSelect = document.querySelector('#post-filter');
const postButton = document.querySelector('.post-button');
const profileImageBtn = document.querySelector('.camera-button-small');
const coverImageBtn = document.querySelector('.camera-button');
const searchIcon = document.querySelector('#search-icon');
const notificationIcon = document.querySelector('#notification-icon');
const menuIcon = document.querySelector('#menu-icon');
const postTemplate = document.querySelector('#post-template');

let currentPosts = [...allPosts];
let currentTab = 'your-posts';

// Initialize Profile
function initializeProfile() {
    // Set profile name and location
    document.querySelector('.profile-sidebar h2').textContent = userProfile.name;
    document.querySelector('.location').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${userProfile.location}`;
    
    // Set score
    document.querySelector('.score').textContent = userProfile.score;
    document.querySelector('.score-change').textContent = userProfile.scoreChange;
    
    // Initialize badges
    const badgesGrid = document.querySelector('.badges-grid');
    badgesGrid.innerHTML = userProfile.badges.map(badge => `
        <div class="badge">
            <i class="fas ${badge.icon}"></i>
            <span>${badge.name}</span>
        </div>
    `).join('');
}

// Render posts with enhanced functionality
function renderPosts(postsData) {
    postsContainer.innerHTML = '';
    postsData.forEach(post => {
        const postElement = postTemplate.content.cloneNode(true);
        
        // Set post author info
        const authorImg = postElement.querySelector('.author-avatar img');
        if (post.avatar) {
            authorImg.src = post.avatar;
            authorImg.alt = post.author;
        } else {
            const authorAvatar = postElement.querySelector('.author-avatar');
            authorAvatar.innerHTML = '<div class="anonymous-avatar"><i class="fas fa-user"></i></div>';
        }
        
        postElement.querySelector('.author-info h4').textContent = post.author;
        postElement.querySelector('.author-info span').textContent = post.time;
        
        // Set post content
        postElement.querySelector('.category-tag').textContent = post.category;
        postElement.querySelector('.post-content p').textContent = post.content;
        
        // Set top answer if exists
        const topAnswerSection = postElement.querySelector('.top-answer');
        if (post.topAnswer) {
            topAnswerSection.querySelector('p').textContent = post.topAnswer;
        } else {
            topAnswerSection.remove();
        }
        
        // Set answers count
        postElement.querySelector('.answers-count span').textContent = 
            `${post.answers} ${post.answers === 1 ? 'answer' : 'answers'}`;
        
        // Set like and save states
        const likeButton = postElement.querySelector('.like-button');
        const saveButton = postElement.querySelector('.save-post');
        
        if (post.isLiked) {
            likeButton.classList.add('liked');
            likeButton.querySelector('i').classList.replace('far', 'fas');
        }
        
        if (post.isSaved) {
            saveButton.classList.add('saved');
            saveButton.querySelector('i').classList.replace('far', 'fas');
            saveButton.textContent = 'Saved';
        }
        
        // Add event listeners
        const postDiv = postElement.querySelector('.post');
        postDiv.dataset.postId = post.id;
        
        // Like button
        likeButton.addEventListener('click', () => toggleLike(post.id));
        
        // Save button
        saveButton.addEventListener('click', () => toggleSave(post.id));
        
        // Share button
        postElement.querySelector('.share-button').addEventListener('click', () => sharePost(post));
        
        // Report button
        postElement.querySelector('.report-post').addEventListener('click', () => reportPost(post.id));
        
        // Delete button - Only show for user's own posts
        const deleteButton = postElement.querySelector('.delete-post');
        if (post.author === userProfile.name) {
            deleteButton.style.display = 'block';
            deleteButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const postId = parseInt(postDiv.dataset.postId);
                deletePost(postId);
            });
        } else {
            deleteButton.style.display = 'none';
        }
        
        // Dropdown toggle
        const moreOptions = postElement.querySelector('.more-options');
        const dropdown = postElement.querySelector('.dropdown-content');
        
        moreOptions.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.post-actions-dropdown')) {
                dropdown.classList.remove('show');
            }
        });
        
        postsContainer.appendChild(postElement);
    });
}

// Post Actions
function toggleLike(postId) {
    const post = currentPosts.find(p => p.id === postId);
    if (post) {
        post.isLiked = !post.isLiked;
        const originalPost = allPosts.find(p => p.id === postId);
        if (originalPost) {
            originalPost.isLiked = post.isLiked;
        }
        renderPosts(currentPosts);
    }
}

function toggleSave(postId) {
    const post = currentPosts.find(p => p.id === postId);
    if (post) {
        post.isSaved = !post.isSaved;
        const originalPost = allPosts.find(p => p.id === postId);
        if (originalPost) {
            originalPost.isSaved = post.isSaved;
        }
        renderPosts(currentPosts);
    }
}

function sharePost(post) {
    if (navigator.share) {
        navigator.share({
            title: `Post by ${post.author}`,
            text: post.content,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = `${window.location.href}#post-${post.id}`;
        alert(`Share this link: ${shareUrl}`);
    }
}

function reportPost(postId) {
    const reason = prompt('Please provide a reason for reporting this post:');
    if (reason) {
        alert('Thank you for your report. We will review it shortly.');
    }
}

function deletePost(postId) {
    console.log('Deleting post with ID:', postId);
    
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        // Remove from current posts
        currentPosts = currentPosts.filter(post => post.id !== postId);
        
        // Remove from all posts
        const postIndex = allPosts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
            allPosts.splice(postIndex, 1);
        }
        
        // Re-render the posts
        renderPosts(currentPosts);
        
        // Show confirmation toast
        showToast('Post deleted successfully');
    }
}

// Toast notification function
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Create New Post
function createNewPost() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Create New Post</h3>
            <select id="post-category">
                <option value="">Select Category</option>
                <option value="Beauty">Beauty</option>
                <option value="Work">Work</option>
                <option value="Relationships">Relationships</option>
                <option value="General">General</option>
            </select>
            <textarea id="post-content" placeholder="What's on your mind?"></textarea>
            <div class="modal-actions">
                <button class="cancel-post">Cancel</button>
                <button class="submit-post">Post</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const cancelBtn = modal.querySelector('.cancel-post');
    const submitBtn = modal.querySelector('.submit-post');
    const textarea = modal.querySelector('#post-content');
    const categorySelect = modal.querySelector('#post-category');

    cancelBtn.addEventListener('click', () => modal.remove());
    submitBtn.addEventListener('click', () => {
        if (textarea.value.trim() && categorySelect.value) {
            const newPost = {
                id: Date.now(),
                author: userProfile.name,
                time: 'Just now',
                category: categorySelect.value,
                content: textarea.value.trim(),
                answers: 0,
                isLiked: false,
                isSaved: false
            };
            allPosts.unshift(newPost);
            if (currentTab === 'your-posts') {
                currentPosts.unshift(newPost);
                renderPosts(currentPosts);
            }
            modal.remove();
            showToast('Post created successfully');
        } else {
            alert('Please fill in all fields');
        }
    });
}

// Profile Actions
function handleProfileImageUpdate() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.querySelector('.profile-image').src = e.target.result;
                showToast('Profile image updated');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function handleCoverImageUpdate() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.querySelector('.cover-image').style.backgroundImage = `url(${e.target.result})`;
                showToast('Cover image updated');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// Tab switching with filtering
function switchTab(tabName) {
    currentTab = tabName;
    tabs.forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    switch (tabName) {
        case 'liked-posts':
            currentPosts = allPosts.filter(post => post.isLiked);
            break;
        case 'saved-posts':
            currentPosts = allPosts.filter(post => post.isSaved);
            break;
        default:
            currentPosts = [...allPosts];
    }
    renderPosts(currentPosts);
}

// Event Listeners
postButton.addEventListener('click', createNewPost);
profileImageBtn.addEventListener('click', handleProfileImageUpdate);
coverImageBtn.addEventListener('click', handleCoverImageUpdate);

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
    });
});

filterSelect.addEventListener('change', (e) => {
    const filterValue = e.target.value.toLowerCase();
    if (filterValue === 'all-posts') {
        renderPosts(currentPosts);
    } else {
        const filteredPosts = currentPosts.filter(post => 
            post.category.toLowerCase() === filterValue
        );
        renderPosts(filteredPosts);
    }
});

// Navigation Actions
searchIcon.addEventListener('click', () => {
    const searchTerm = prompt('Enter search term:');
    if (searchTerm) {
        const searchResults = allPosts.filter(post => 
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderPosts(searchResults);
    }
});

notificationIcon.addEventListener('click', () => {
    alert('No new notifications');
});

menuIcon.addEventListener('click', () => {
    const menu = document.createElement('div');
    menu.className = 'menu-overlay';
    menu.innerHTML = `
        <div class="menu-content">
            <button class="menu-close"><i class="fas fa-times"></i></button>
            <ul>
                <li><i class="fas fa-user"></i> Edit Profile</li>
                <li><i class="fas fa-cog"></i> Settings</li>
                <li><i class="fas fa-question-circle"></i> Help</li>
                <li><i class="fas fa-sign-out-alt"></i> Logout</li>
            </ul>
        </div>
    `;
    document.body.appendChild(menu);
    menu.classList.add('show');

    const closeBtn = menu.querySelector('.menu-close');
    closeBtn.addEventListener('click', () => {
        menu.classList.remove('show');
        setTimeout(() => menu.remove(), 300);
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(dropdown => {
        if (dropdown.classList.contains('show') && !e.target.closest('.post-actions-dropdown')) {
            dropdown.classList.remove('show');
        }
    });
});

// Initialize
initializeProfile();
renderPosts(currentPosts); 