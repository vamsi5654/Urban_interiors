// Portfolio Component
const Portfolio = () => {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Date');
  const [selectedImage, setSelectedImage] = useState(null);

  const portfolioItems = [
    {
      id: 1,
      title: 'Modern Kitchen',
      category: 'Kitchen',
      style: 'Minimalist',
      date: '2025-07-01',
      popularity: 89,
      location: 'Mumbai',
      image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 300\'%3E%3Crect fill=\'%23e8f4f8\' width=\'400\' height=\'300\'/%3E%3Ctext x=\'200\' y=\'150\' text-anchor=\'middle\' font-size=\'20\' fill=\'%23666\'%3EModern Kitchen%3C/text%3E%3C/svg%3E'
    },
    {
      id: 2,
      title: 'Cozy Living Room',
      category: 'Living Room',
      style: 'Classic',
      date: '2025-06-15',
      popularity: 95,
      location: 'Delhi',
      image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 300\'%3E%3Crect fill=\'%23f8e8e8\' width=\'400\' height=\'300\'/%3E%3Ctext x=\'200\' y=\'150\' text-anchor=\'middle\' font-size=\'18\' fill=\'%23666\'%3ECozy Living Room%3C/text%3E%3C/svg%3E'
    },
    {
      id: 3,
      title: 'Executive Office',
      category: 'Office',
      style: 'Modern',
      date: '2025-05-20',
      popularity: 78,
      location: 'Bangalore',
      image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 300\'%3E%3Crect fill=\'%23e8f8e8\' width=\'400\' height=\'300\'/%3E%3Ctext x=\'200\' y=\'150\' text-anchor=\'middle\' font-size=\'20\' fill=\'%23666\'%3EExecutive Office%3C/text%3E%3C/svg%3E'
    },
    {
      id: 4,
      title: 'Luxury Bedroom',
      category: 'Bedroom',
      style: 'Luxury',
      date: '2025-04-10',
      popularity: 92,
      location: 'Chennai',
      image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 300\'%3E%3Crect fill=\'%23f8f0e8\' width=\'400\' height=\'300\'/%3E%3Ctext x=\'200\' y=\'150\' text-anchor=\'middle\' font-size=\'20\' fill=\'%23666\'%3ELuxury Bedroom%3C/text%3E%3C/svg%3E'
    }
  ];

  const categories = ['All', 'Kitchen', 'Living Room', 'Office', 'Bedroom'];
  const sortOptions = ['Date', 'Popularity', 'Location'];

  const filteredItems = portfolioItems
    .filter(item => filter === 'All' || item.category === filter)
    .sort((a, b) => {
      if (sortBy === 'Date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'Popularity') return b.popularity - a.popularity;
      if (sortBy === 'Location') return a.location.localeCompare(b.location);
      return 0;
    });

  return (
    <section style={{
      padding: '5rem 2rem',
      backgroundColor: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#2c3e50'
        }}>
          Our Portfolio
        </h2>

        {/* Filter and Sort Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Filter size={20} />
            <span>Filter:</span>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: filter === category ? '#e74c3c' : 'transparent',
                  color: filter === category ? 'white' : '#2c3e50',
                  border: '1px solid #e74c3c',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {sortOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  color: '#2c3e50'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: '#7f8c8d',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem'
                }}>
                  {item.style} • {item.location}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '15px',
                    fontSize: '0.8rem'
                  }}>
                    {item.category}
                  </span>
                  <span style={{
                    color: '#f39c12',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <Star size={16} fill="currentColor" />
                    {item.popularity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '2rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              overflow: 'hidden',
              maxWidth: '800px',
              maxHeight: '90vh',
              position: 'relative'
            }}>
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  zIndex: 1
                }}
              >
                <X size={20} />
              </button>
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '2rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#2c3e50'
                }}>
                  {selectedImage.title}
                </h3>
                <p style={{
                  color: '#7f8c8d',
                  marginBottom: '1rem'
                }}>
                  Style: {selectedImage.style} | Location: {selectedImage.location}
                </p>
                <p style={{
                  color: '#7f8c8d',
                  marginBottom: '1rem'
                }}>
                  Date: {selectedImage.date} | Popularity: {selectedImage.popularity}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
