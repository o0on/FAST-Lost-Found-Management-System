import React, { useState, useEffect } from 'react';

import { Search, Moon, Sun, MapPin, Tag, CheckCircle, Upload, X, User, UserCircle, Building, Phone, LogOut, Mail, Lock, Eye, MessageCircle, Calendar, ArrowUpDown, Filter, Trash2, Edit } from 'lucide-react';

// --- Mock Data ---

const initialItems = [

  {

    id: 1,

    title: "Black Laptop Backpack",

    description: "Contains laptop and charger",

    category: "Bags",

    location: "Library",

    date: "2024-11-05",

    status: "lost",

    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",

    claimed: false,

    ownerEmail: "demo@isb.nu.edu.pk",

    ownerName: "Demo User"

  },

  {

    id: 2,

    title: "Silver iPhone 13",

    description: "Blue case with stickers",

    category: "Electronics",

    location: "Cafeteria",

    date: "2024-11-06",

    status: "found",

    image: "https://images.unsplash.com/photo-1592286927505-38a734ff9b8b?w=400",

    claimed: false,

    ownerEmail: "demo@isb.nu.edu.pk",

    ownerName: "Demo User"

  },

  {

    id: 3,

    title: "Red Water Bottle",

    description: "Insulated steel bottle",

    category: "Personal Items",

    location: "Gym",

    date: "2024-11-07",

    status: "found",

    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",

    claimed: false,

    ownerEmail: "demo@isb.nu.edu.pk",

    ownerName: "Demo User"

  },

  {

    id: 4,

    title: "Chemistry Textbook",

    description: "2023 edition with notes",

    category: "Books",

    location: "Science Block",

    date: "2024-11-04",

    status: "lost",

    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",

    claimed: false,

    ownerEmail: "demo@isb.nu.edu.pk",

    ownerName: "Demo User"

  }

];

const categories = ["All", "Electronics", "Books", "Bags", "Clothing", "Personal Items", "ID Cards", "Keys"];

const locations = ["All", "Library", "Cafeteria", "Gym", "Hostel", "Science Block", "Admin Block"];

// Department structure for FAST

const departmentStructure = {

  "School of Computing": [

    "Software Engineering",

    "Computer Science",

    "Artificial Intelligence",

    "Data Science",

    "Cyber Security"

  ],

  "School of Engineering": [

    "Electrical Engineering",

    "Computer Engineering"

  ],

  "School of Management": [

    "Accounting and Finance",

    "Fintech",

    "Business Administration",

    "Business Analytics"

  ]

};

// Placeholder image URL for items without photos

const PLACEHOLDER_IMAGE = "https://placehold.co/400x300/a8b9c9/ffffff?text=No+Image";

export default function App() {

  // Story #1: Login/Register with persistent storage (using localStorage as mock DB)

  const [isLoggedIn, setIsLoggedIn] = useState(() => {

    const saved = localStorage.getItem('isLoggedIn');

    return saved === 'true';

  });

  const [showAuthModal, setShowAuthModal] = useState(() => {

    const saved = localStorage.getItem('isLoggedIn');

    return saved !== 'true';

  });

  const [isRegistering, setIsRegistering] = useState(false);

  const [authForm, setAuthForm] = useState({

    email: "",

    password: "",

    name: "",

    school: "",

    department: "",

    phone: ""

  });

  const [authError, setAuthError] = useState("");

  const [users, setUsers] = useState(() => {

    const saved = localStorage.getItem('users');

    return saved ? JSON.parse(saved) : [];

  });

  

  // Story #10: Dark/Light Mode

  const [darkMode, setDarkMode] = useState(false);

  

  // Story #2: Profile Management with persistent storage

  const [showProfile, setShowProfile] = useState(false);

  const [profile, setProfile] = useState(() => {

    const saved = localStorage.getItem('currentUser');

    return saved ? JSON.parse(saved) : {

      name: "",

      email: "",

      school: "",

      department: "",

      phone: ""

    };

  });

  

  // Story #13: Photo Upload & Preview (for creating posts)

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const [newPost, setNewPost] = useState({

    title: "",

    description: "",

    category: "Electronics",

    location: "Library",

    status: "lost",

    images: [] // Storing image URLs/blobs here temporarily

  });

  

  // Story #5, #6, #7: Search and Filters

  const [items, setItems] = useState(() => {

    const saved = localStorage.getItem('items');

    return saved ? JSON.parse(saved) : initialItems;

  });

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [selectedLocation, setSelectedLocation] = useState("All");

  const [activeTab, setActiveTab] = useState("all");

  // New Features: Toast, Item Details, Sort, My Posts
  const [toasts, setToasts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [itemOwner, setItemOwner] = useState(null);

  

  // Save items and user data to localStorage whenever they change

  useEffect(() => {

    localStorage.setItem('items', JSON.stringify(items));

  }, [items]);

  useEffect(() => {

    localStorage.setItem('users', JSON.stringify(users));

  }, [users]);

  

  useEffect(() => {

    if (profile.email) {

      localStorage.setItem('currentUser', JSON.stringify(profile));

    }

  }, [profile]);

  // Apply dark mode class to HTML element

  useEffect(() => {

    if (darkMode) {

      document.documentElement.classList.add('dark');

    } else {

      document.documentElement.classList.remove('dark');

    }

  }, [darkMode]);

  

  // Toast Notification System
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Story #5: Search functionality with Sort
  let filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesLocation = selectedLocation === "All" || item.location === selectedLocation;
    const matchesTab = activeTab === "all" || item.status === activeTab;
    
    // Filter for My Posts if enabled
    if (showMyPosts && item.ownerEmail !== profile.email) {
      return false;
    }
    
    return matchesSearch && matchesCategory && matchesLocation && matchesTab;
  });

  // Sort functionality
  filteredItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === "oldest") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === "category") {
      return a.category.localeCompare(b.category);
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  

  // Story #8: Mark Item as Claimed
  const handleMarkClaimed = (itemId) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, claimed: true } : item
    ));
    showToast('Item marked as claimed successfully!', 'success');
  };

  // Item Details Modal
  const handleItemClick = (item) => {
    // Find owner info if available
    const owner = users.find(u => u.email === item.ownerEmail);
    setItemOwner(owner || null);
    setSelectedItem(item);
    setShowItemDetails(true);
  };

  // Contact Owner
  const handleContactOwner = (item) => {
    const owner = users.find(u => u.email === item.ownerEmail);
    if (owner) {
      if (owner.phone) {
        window.open(`tel:${owner.phone}`, '_self');
        showToast(`Calling ${owner.name}...`, 'info');
      } else if (owner.email) {
        window.open(`mailto:${owner.email}?subject=Regarding: ${item.title}`, '_self');
        showToast(`Opening email to ${owner.name}...`, 'info');
      } else {
        showToast('Owner contact information not available', 'error');
      }
    } else {
      showToast('Owner information not found', 'error');
    }
  };

  // Delete Item (only for owner)
  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== itemId));
      setShowItemDetails(false);
      showToast('Item deleted successfully', 'success');
    }
  };

  

  // Story #13: Handle image upload for posts

  const handleImageUpload = (e) => {

    const files = Array.from(e.target.files);

    const newImages = files.map(file => ({

      id: Date.now() + Math.random(),

      url: URL.createObjectURL(file), // Create blob URL for preview

      name: file.name

    }));

    setNewPost({ ...newPost, images: [...newPost.images, ...newImages] });

  };

  

  const removeImageFromPost = (imageId) => {

    setNewPost({

      ...newPost,

      images: newPost.images.filter(img => img.id !== imageId)

    });

  };

  

  const handleCreatePost = () => {

    if (!newPost.title.trim() || !newPost.description.trim()) {

      showToast('Please fill in title and description', 'error');

      return;

    }

    

    const post = {

      id: Date.now(),

      title: newPost.title,

      description: newPost.description,

      category: newPost.category,

      location: newPost.location,

      status: newPost.status,

      // Use the first uploaded image URL, or the placeholder

      image: newPost.images.length > 0 ? newPost.images[0].url : PLACEHOLDER_IMAGE,

      images: newPost.images.map(img => img.url), // Store all images

      claimed: false,

      date: new Date().toISOString().split('T')[0],

      ownerEmail: profile.email, // Track who created the post

      ownerName: profile.name

    };

    

    // Prepend new post to the list

    setItems([post, ...items]);

    

    // Clean up temporary object URLs (crucial for memory management)

    newPost.images.forEach(img => URL.revokeObjectURL(img.url));

    setShowCreatePostModal(false);

    showToast('Item posted successfully!', 'success');

    // Reset new post form

    setNewPost({

      title: "",

      description: "",

      category: "Electronics",

      location: "Library",

      status: "lost",

      images: []

    });

  };

  

  // Story #2: Update profile

  const handleProfileUpdate = (field, value) => {

    const updatedProfile = { ...profile, [field]: value };

    setProfile(updatedProfile);

    

    // Update in users array as well

    const updatedUsers = users.map(u => 

      u.email === profile.email 

        ? { ...u, [field]: value }

        : u

    );

    setUsers(updatedUsers);

  };

  

  // Story #1: Handle Login/Register

  const validateUniversityEmail = (email) => {

    // FAST Islamabad campus email validation

    return email.endsWith('@isb.nu.edu.pk');

  };

  

  const handleAuth = (e) => {

    if (e) e.preventDefault();

    setAuthError("");

    

    // Validate FAST university email

    if (!validateUniversityEmail(authForm.email)) {

      setAuthError("Please use your FAST Islamabad email (@isb.nu.edu.pk)");

      return;

    }

    

    // Validate password

    if (authForm.password.length < 6) {

      setAuthError("Password must be at least 6 characters long");

      return;

    }

    

    if (isRegistering) {

      // Registration flow

      if (!authForm.name.trim() || !authForm.school || !authForm.department.trim()) {

        setAuthError("Please fill in all required fields (Name, School, Department).");

        return;

      }

      

      // Check if user already exists

      const existingUser = users.find(u => u.email === authForm.email);

      if (existingUser) {

        setAuthError("An account with this email already exists. Please login instead.");

        return;

      }

      

      // Create new user

      const newUser = {

        email: authForm.email,

        password: authForm.password,

        name: authForm.name,

        school: authForm.school,

        department: authForm.department,

        phone: authForm.phone

      };

      

      const updatedUsers = [...users, newUser];

      setUsers(updatedUsers);

      

      // Set current user profile

      const userProfile = {

        name: newUser.name,

        email: newUser.email,

        school: newUser.school,

        department: newUser.department,

        phone: newUser.phone

      };

      setProfile(userProfile);

      localStorage.setItem('isLoggedIn', 'true');

      

      setIsLoggedIn(true);

      setShowAuthModal(false);

      setAuthForm({ email: "", password: "", name: "", school: "", department: "", phone: "" });

      showToast('Account created successfully! Welcome!', 'success');

      

    } else {

      // Login flow

      const user = users.find(u => u.email === authForm.email && u.password === authForm.password);

      

      if (!user) {

        setAuthError("Invalid email or password. Please try again.");

        showToast('Invalid email or password', 'error');

        return;

      }

      

      // Set current user profile

      const userProfile = {

        name: user.name,

        email: user.email,

        school: user.school,

        department: user.department,

        phone: user.phone

      };

      setProfile(userProfile);

      localStorage.setItem('isLoggedIn', 'true');

      

      setIsLoggedIn(true);

      setShowAuthModal(false);

      setAuthForm({ email: "", password: "", name: "", school: "", department: "", phone: "" });

      showToast(`Welcome back, ${user.name}!`, 'success');

    }

  };

  

  const handleSchoolChange = (school) => {

    setAuthForm({ 

      ...authForm, 

      school: school,

      department: "" // Reset department when school changes

    });

  };

  

  const handleLogout = () => {

    // Clean up blob URLs for safety, though app state is reset

    items.forEach(item => {

        if (item.image && item.image.startsWith('blob:')) {

            URL.revokeObjectURL(item.image);

        }

    });

    setIsLoggedIn(false);

    setShowAuthModal(true);

    setIsRegistering(false); // Reset to login page

    setAuthForm({ email: "", password: "", name: "", school: "", department: "", phone: "" });

    localStorage.removeItem('isLoggedIn');

    localStorage.removeItem('currentUser');

    showToast('Logged out successfully', 'info');

  };

  

  const handleAuthFormChange = (field, value) => {

    setAuthForm({ ...authForm, [field]: value });

    setAuthError("");

  };

  

  // Custom Card Component (Item Display)

  const ItemCard = ({ item }) => {

    const isOwner = item.ownerEmail === profile.email;

    return (

      <div

        key={item.id}

        className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden shadow-lg transition duration-300 hover:shadow-xl cursor-pointer`}

        onClick={() => handleItemClick(item)}

      >

        <div className="relative">

          <img

            src={item.image}

            alt={item.title}

            className="w-full h-48 object-cover object-center"

            onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}

          />

          {isOwner && (

            <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">

              My Post

            </span>

          )}

        </div>

        <div className="p-4 sm:p-5">

          <div className="flex justify-between items-start mb-2">

            <h3 className={`font-extrabold text-xl ${darkMode ? 'text-white' : 'text-gray-900'} leading-snug`}>

              {item.title}

            </h3>

            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${

              item.status === 'lost'

                ? 'bg-red-500 text-white'

                : 'bg-green-500 text-white'

            } shadow-md`}>

              {item.status.toUpperCase()}

            </span>

          </div>

          <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}>

            {item.description}

          </p>

          

          <div className="space-y-2 mb-4 text-sm">

            <div className="flex items-center gap-2">

              <Tag size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />

              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Category: <span className='font-medium'>{item.category}</span></span>

            </div>

            <div className="flex items-center gap-2">

              <MapPin size={16} className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />

              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Location: <span className='font-medium'>{item.location}</span></span>

            </div>

            <p className={`text-xs pt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>

              Reported: {new Date(item.date).toLocaleDateString()}

            </p>

          </div>

          

          {/* Simple click to view details - all actions in modal */}

          <div className={`w-full py-2 rounded-xl text-center font-semibold text-sm ${

            item.claimed 

              ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200'

              : darkMode 

              ? 'bg-gray-700 text-gray-300'

              : 'bg-gray-100 text-gray-700'

          }`}>

            {item.claimed ? (

              <span className="flex items-center justify-center gap-2">

                <CheckCircle size={16} /> Claimed & Resolved

              </span>

            ) : (

              <span className="flex items-center justify-center gap-2">

                <Eye size={16} /> Click to view details

              </span>

            )}

          </div>

        </div>

      </div>

    );

  };

  return (

    <div className={`min-h-screen transition-colors duration-300 font-sans ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>

      {/* Story #1: Login/Register Modal */}

      {showAuthModal && !isLoggedIn && (

        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-4 sm:p-6 md:p-8 shadow-2xl my-4 sm:my-8 max-h-[95vh] overflow-y-auto`}>

            <div className="text-center mb-6">

              <h2 className={`text-3xl font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>

                FAST Lost & Found

              </h2>

              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>

                {isRegistering ? 'Create your university account' : 'Sign in to access the system'}

              </p>

            </div>

            {authError && (

              <div className="mb-4 p-3 bg-red-500 text-white rounded-lg text-sm font-medium">

                {authError}

              </div>

            )}

            <form onSubmit={handleAuth} className="space-y-4">

              

              {isRegistering && (

                <div>

                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>

                  <div className="relative">

                    <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

                    <input

                      type="text"

                      value={authForm.name}

                      onChange={(e) => handleAuthFormChange('name', e.target.value)}

                      placeholder="Enter your full name"

                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}

                      required={isRegistering}

                    />

                  </div>

                </div>

              )}

              <div>

                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>FAST University Email</label>

                <div className="relative">

                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

                  <input

                    type="email"

                    value={authForm.email}

                    onChange={(e) => handleAuthFormChange('email', e.target.value)}

                    placeholder="yourname@isb.nu.edu.pk"

                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}

                    required

                  />

                </div>

                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>

                  Must use your FAST Islamabad email

                </p>

              </div>

              {isRegistering && (

                <>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

                    <div>

                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>School</label>

                      <div className="relative">

                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

                        <select

                          value={authForm.school}

                          onChange={(e) => handleSchoolChange(e.target.value)}

                          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}

                          required={isRegistering}

                        >

                          <option value="">Select School</option>

                          {Object.keys(departmentStructure).map(school => (

                            <option key={school} value={school}>{school}</option>

                          ))}

                        </select>

                      </div>

                    </div>

                    <div>

                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Department</label>

                      <div className="relative">

                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

                        <select

                          value={authForm.department}

                          onChange={(e) => handleAuthFormChange('department', e.target.value)}

                          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}

                          required={isRegistering}

                          disabled={!authForm.school}

                        >

                          <option value="">Select Department</option>

                          {authForm.school && departmentStructure[authForm.school].map(dept => (

                            <option key={dept} value={dept}>{dept}</option>

                          ))}

                        </select>

                      </div>

                    </div>

                  </div>

                  <div>

                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number (Optional)</label>

                    <div className="relative">

                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

                      <input

                        type="tel"

                        value={authForm.phone}

                        onChange={(e) => handleAuthFormChange('phone', e.target.value)}

                        placeholder="+92 300 1234567"

                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}

                      />

                    </div>

                  </div>

                </>

              )}

              <div>

                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

                  <input

                    type="password"

                    value={authForm.password}

                    onChange={(e) => handleAuthFormChange('password', e.target.value)}

                    placeholder="Enter your password"

                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}

                    required

                  />

                </div>

                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>

                  Minimum 6 characters

                </p>

              </div>

              <button

                type="submit"

                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300 font-bold shadow-lg"

              >

                {isRegistering ? 'Create Account' : 'Sign In'}

              </button>

            </form>

            <div className="mt-6 text-center">

              <button

                onClick={() => {

                  setIsRegistering(!isRegistering);

                  setAuthError("");

                  setAuthForm({ ...authForm, name: "", school: "", department: "", phone: "" }); // Clear optional fields on toggle

                }}

                className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium transition`}

              >

                {isRegistering 

                  ? 'Already have an account? Sign in' 

                  : "Don't have an account? Register"}

              </button>

            </div>

          </div>

        </div>

      )}

      {/* Header */}

      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between">

          <h1 className={`text-lg sm:text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} truncate pr-2`}>

            🔍 FAST Lost & Found

          </h1>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 flex-shrink-0">

            {/* Story #10: Dark/Light Mode Toggle */}

            <button

              onClick={() => setDarkMode(!darkMode)}

              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'} hover:opacity-80 transition`}

              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}

            >

              {darkMode ? <Sun size={20} /> : <Moon size={20} />}

            </button>

            

            {/* User Actions */}

            {isLoggedIn && (

              <>

                <button

                  onClick={() => setShowProfile(!showProfile)}

                  className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'} hover:opacity-80 transition`}

                  title="Profile"

                >

                  <User size={20} />

                </button>

                

                <button

                  onClick={handleLogout}

                  className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-red-400' : 'bg-gray-100 text-red-600'} hover:opacity-80 transition`}

                  title="Logout"

                >

                  <LogOut size={20} />

                </button>

              </>

            )}

          </div>

        </div>

      </header>

      {/* Story #2: Profile Modal */}

      {showProfile && (

        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-6 shadow-2xl`}>

            <div className="flex justify-between items-center mb-6">

              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>

                User Profile

              </h2>

              <button onClick={() => setShowProfile(false)} className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>

                <X size={24} />

              </button>

            </div>

            <div className="space-y-4">

              {/* Profile fields */}

              {['name', 'email', 'school', 'department', 'phone'].map(field => (

                <div key={field}>

                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>

                    {field.charAt(0).toUpperCase() + field.slice(1)}

                  </label>

                  <input

                    type={field === 'email' ? 'email' : (field === 'phone' ? 'tel' : 'text')}

                    value={profile[field] || ''}

                    onChange={(e) => handleProfileUpdate(field, e.target.value)}

                    disabled={field === 'email' || field === 'school' || field === 'department'}

                    className={`w-full px-4 py-3 rounded-lg border ${

                      (field === 'email' || field === 'school' || field === 'department')

                        ? (darkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-500')

                        : (darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900')

                    } focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition`}

                  />

                  {field === 'email' && <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Email is immutable.</p>}

                </div>

              ))}

              

              <button

                onClick={() => setShowProfile(false)}

                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300 font-bold"

              >

                Close / Save Changes

              </button>

            </div>

          </div>

        </div>

      )}

      {/* Story #13: Create Post Modal with Photo Upload */}

      {showCreatePostModal && (

        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-2xl w-full p-6 shadow-2xl max-h-[95vh] overflow-y-auto`}>

            <div className="flex justify-between items-center mb-6">

              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>

                Report Lost or Found Item

              </h2>

              <button onClick={() => setShowCreatePostModal(false)} className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>

                <X size={24} />

              </button>

            </div>

            

            <div className="space-y-4">

              {/* Status Selector */}

              <div>

                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>

                  Item Status

                </label>

                <div className="flex flex-col sm:flex-row gap-4">

                  <button

                    onClick={() => setNewPost({ ...newPost, status: 'lost' })}

                    className={`flex-1 py-3 rounded-lg border-2 transition font-semibold ${

                      newPost.status === 'lost'

                        ? 'border-red-500 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'

                        : darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'

                    }`}

                  >

                    Report Lost Item

                  </button>

                  <button

                    onClick={() => setNewPost({ ...newPost, status: 'found' })}

                    className={`flex-1 py-3 rounded-lg border-2 transition font-semibold ${

                      newPost.status === 'found'

                        ? 'border-green-500 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'

                        : darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'

                    }`}

                  >

                    Report Found Item

                  </button>

                </div>

              </div>

              {/* Title */}

              <div>

                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>

                <input

                  type="text"

                  value={newPost.title}

                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}

                  placeholder="e.g., Black HP Laptop Charger"

                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}

                />

              </div>

              {/* Description */}

              <div>

                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description (Include identifying details)</label>

                <textarea

                  value={newPost.description}

                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}

                  placeholder="Provide detailed description, color, specific markings, or contents."

                  rows={3}

                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}

                />

              </div>

              {/* Category & Location - RESPONSIVE GRID */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>

                  <select

                    value={newPost.category}

                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}

                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}

                  >

                    {categories.filter(c => c !== 'All').map(cat => (

                      <option key={cat} value={cat}>{cat}</option>

                    ))}

                  </select>

                </div>

                <div>

                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>

                  <select

                    value={newPost.location}

                    onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}

                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}

                  >

                    {locations.filter(l => l !== 'All').map(loc => (

                      <option key={loc} value={loc}>{loc}</option>

                    ))}

                  </select>

                </div>

              </div>

              {/* Photo Upload */}

              <div>

                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>

                  Upload Photos (Up to 5)

                </label>

                <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition ${darkMode ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>

                  <Upload size={24} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />

                  <span className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>

                    Click to upload images

                  </span>

                  <input

                    type="file"

                    multiple

                    accept="image/*"

                    onChange={handleImageUpload}

                    className="hidden"

                    disabled={newPost.images.length >= 5}

                  />

                </label>

                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>

                    {newPost.images.length} / 5 images uploaded.

                </p>

              </div>

              

              {/* Image Preview */}

              {newPost.images.length > 0 && (

                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">

                  {newPost.images.map(img => (

                    <div key={img.id} className="relative group aspect-square">

                      <img

                        src={img.url}

                        alt={img.name}

                        className="w-full h-full object-cover rounded-lg shadow-md"

                      />

                      <button

                        onClick={() => removeImageFromPost(img.id)}

                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-80 group-hover:opacity-100 transition shadow-lg"

                      >

                        <X size={16} />

                      </button>

                    </div>

                  ))}

                </div>

              )}

              {/* Submit Button */}

              <button

                onClick={handleCreatePost}

                className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition duration-300 font-bold shadow-lg"

              >

                Create Post

              </button>

            </div>

          </div>

        </div>

      )}

      {/* Main Content */}

      {isLoggedIn && (

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        

          {/* Tabs - Centered and Responsive */}

          <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6">

            {['all', 'lost', 'found'].map(tab => (

              <button

                key={tab}

                onClick={() => setActiveTab(tab)}

                className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold transition duration-200 ${

                  activeTab === tab

                    ? 'bg-blue-600 text-white shadow-md'

                    : darkMode

                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'

                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'

                }`}

              >

                {tab.charAt(0).toUpperCase() + tab.slice(1)} Items

              </button>

            ))}

          </div>

          <div className='flex flex-col lg:flex-row gap-6 mb-8'>

            

            {/* Left Column: Search & Filters (Always visible, responsive layout) */}

            <div className='w-full lg:w-1/4'>

              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-3 sm:p-4 shadow-lg sticky top-16 sm:top-20`}>

                <h3 className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Filters & Search</h3>

                {/* Search Bar */}

                <div className="relative mb-4">

                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} size={20} />

                  <input

                    type="text"

                    placeholder="Search titles or descriptions..."

                    value={searchQuery}

                    onChange={(e) => setSearchQuery(e.target.value)}

                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}

                  />

                </div>

                {/* Story #6: Category Filter */}

                <div className="mb-4">

                  <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>

                    <Tag size={16} /> Category

                  </label>

                  <select

                    value={selectedCategory}

                    onChange={(e) => setSelectedCategory(e.target.value)}

                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}

                  >

                    {categories.map(cat => (

                      <option key={cat} value={cat}>{cat}</option>

                    ))}

                  </select>

                </div>

                {/* Story #7: Location Filter */}

                <div className="mb-4">

                  <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>

                    <MapPin size={16} /> Location

                  </label>

                  <select

                    value={selectedLocation}

                    onChange={(e) => setSelectedLocation(e.target.value)}

                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}

                  >

                    {locations.map(loc => (

                      <option key={loc} value={loc}>{loc}</option>

                    ))}

                  </select>

                </div>

                {/* Sort Functionality */}

                <div className="mb-4">

                  <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>

                    <ArrowUpDown size={16} /> Sort By

                  </label>

                  <select

                    value={sortBy}

                    onChange={(e) => setSortBy(e.target.value)}

                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}

                  >

                    <option value="newest">Newest First</option>

                    <option value="oldest">Oldest First</option>

                    <option value="title">Title (A-Z)</option>

                    <option value="category">Category</option>

                  </select>

                </div>

                {/* My Posts Toggle */}

                <div className="mb-6">

                  <button

                    onClick={() => setShowMyPosts(!showMyPosts)}

                    className={`w-full px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 font-semibold shadow-md ${

                      showMyPosts

                        ? 'bg-blue-600 text-white hover:bg-blue-700'

                        : darkMode

                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'

                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'

                    }`}

                  >

                    <User size={18} />

                    {showMyPosts ? 'Show All Posts' : 'Show My Posts Only'}

                  </button>

                </div>

                

                {/* Story #13: Upload Button in Filter Sidebar */}

                <button

                  onClick={() => setShowCreatePostModal(true)}

                  className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 font-bold shadow-md"

                >

                  <Upload size={20} />

                  New Lost/Found Post

                </button>

              </div>

            </div>

            {/* Right Column: Items Grid (Responsive Grid) */}

            <div className='w-full lg:w-3/4'>

              <div className="flex justify-between items-center mb-3 sm:mb-4">

                <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} break-words`}>

                  {showMyPosts ? 'My Posts' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + ' Items'} ({filteredItems.length})

                </h2>

              </div>

              

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                {filteredItems.map(item => (

                  <ItemCard key={item.id} item={item} />

                ))}

              </div>

              {filteredItems.length === 0 && (

                <div className={`text-center py-12 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'} border rounded-xl shadow-lg`}>

                  <p className="text-xl font-semibold mb-2">Nothing found here!</p>

                  <p>Try adjusting your search query or filters.</p>

                </div>

              )}

            </div>

          </div>

        </main>

      )}

      {/* Toast Notifications - Responsive */}
      <div className="fixed bottom-4 right-2 sm:right-4 left-2 sm:left-auto z-50 flex flex-col gap-2 max-w-[calc(100vw-1rem)] sm:max-w-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 w-full sm:min-w-[300px] animate-slide-in text-sm sm:text-base ${
              toast.type === 'success'
                ? 'bg-green-500 text-white'
                : toast.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            <CheckCircle size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-medium truncate">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Item Details Modal - Fully Responsive */}
      {showItemDetails && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl`}>
            <div className="sticky top-0 bg-inherit border-b border-gray-300 dark:border-gray-700 p-4 sm:p-6 flex justify-between items-center">
              <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Item Details
              </h2>
              <button
                onClick={() => setShowItemDetails(false)}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} p-1`}
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {/* Image Gallery */}
              <div className="mb-4 sm:mb-6">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-xl mb-3 sm:mb-4"
                  onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                />
                {selectedItem.images && selectedItem.images.length > 1 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selectedItem.images.slice(1, 5).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${selectedItem.title} ${idx + 2}`}
                        className="w-full h-16 sm:h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                  <h3 className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'} break-words`}>
                    {selectedItem.title}
                  </h3>
                  <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${
                    selectedItem.status === 'lost'
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}>
                    {selectedItem.status.toUpperCase()}
                  </span>
                </div>

                <p className={`text-base sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedItem.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-300 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Tag size={20} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedItem.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedItem.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reported Date</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(selectedItem.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {selectedItem.ownerName && (
                    <div className="flex items-center gap-2">
                      <User size={20} className={darkMode ? 'text-green-400' : 'text-green-600'} />
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Posted By</p>
                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedItem.ownerName}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Responsive */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-300 dark:border-gray-700">
                  {selectedItem.ownerEmail === profile.email ? (
                    <button
                      onClick={() => handleDeleteItem(selectedItem.id)}
                      className="w-full sm:flex-1 bg-red-600 text-white py-2.5 sm:py-3 rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
                    >
                      <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Delete Item
                    </button>
                  ) : (
                    <button
                      onClick={() => handleContactOwner(selectedItem)}
                      className="w-full sm:flex-1 bg-green-600 text-white py-2.5 sm:py-3 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
                    >
                      <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Contact Owner
                    </button>
                  )}
                  {!selectedItem.claimed && (
                    <button
                      onClick={() => {
                        handleMarkClaimed(selectedItem.id);
                        setShowItemDetails(false);
                      }}
                      className="w-full sm:flex-1 bg-blue-600 text-white py-2.5 sm:py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
                    >
                      <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Mark as Claimed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>

  );

}

