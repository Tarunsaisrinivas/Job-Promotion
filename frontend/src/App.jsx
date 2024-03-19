import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [shown, setShown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    role: '',
    promoted: false
  });
  const [list, setList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    const { id, name, role } = formData;

    if(id && name && role){
      alert('Thank you for filling the details');
    }
    else{
      alert("please fill the details");
    }
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/add-new', formData);
      console.log('Item added successfully');
      setFormData({
        id: '',
        name: '',
        role: '',
        promoted: false
      });
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/get-all');
      setList(response.data.list);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    const filtered = list.filter(item => {
      const searchTermLower = searchTerm.toLowerCase(); // Convert search term to lowercase
      const itemIdLower = item.id.toLowerCase(); // Convert item ID to lowercase
      const itemNameLower = item.name.toLowerCase(); // Convert item name to lowercase
      return itemIdLower.includes(searchTermLower) || itemNameLower.includes(searchTermLower);
    });
    setFilteredItems(filtered);
  }, [searchTerm, list]);

  return (
    <div className="container">
      <h1>Add New Item</h1>
      <button className="add-button" onClick={() => setShown(!shown)}>
        {shown ? 'Close' : 'Add Item'}
      </button>
      {shown &&
        <form className="item-form" onSubmit={handleSubmit}>
          <label>
            Staff ID:
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
            />
          </label>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Role:
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
            />
          </label>
          <label>
            Promoted:
            <input
              type="checkbox"
              name="promoted"
              checked={formData.promoted}
              onChange={() =>
                setFormData({
                  ...formData,
                  promoted: !formData.promoted
                })
              }
            />
          </label>
          <button className="submit-button" type="submit">Add Item</button>
        </form>
      }
      <h1>All Items</h1>
      <input
        type="text"
        placeholder="Search by ID or Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="item-list">
        {filteredItems.map((item) => (
          <li key={item._id}>
            <strong>Staff-ID:</strong> {item.id},<br /> <strong>Name:</strong> {item.name},<br /> <strong>Role:</strong> {item.role}, <br /> <strong>Promoted:</strong> {item.promoted ? 'Yes' : 'No'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
