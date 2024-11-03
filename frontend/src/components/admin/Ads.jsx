import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Check, X, ExternalLink } from 'lucide-react';
import axios from 'axios';
import Loader from '../Loader';

const AdPage = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [pendingAds, setPendingAds] = useState([]);
  const [existingAds, setExistingAds] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [deletereqpopup, setdeletereqpopup] = useState(false)
  const [deleteadpopup, setdeleteadpopup] = useState(false)
  const [selected_delete_request, set_selected_delete_request] = useState({adid:"",adname:""})
  const [selected_delete_ad, set_selected_delete_ad] = useState({adid:"",adname:""})
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  async function fetchData() {
    setLoading(true)
    await axios.get('http://localhost:4000/ads/requests').then(async (response) => {
      setPendingAds(response.data);
      await axios.get('http://localhost:4000/ads/newrequests').then((response) => {
        setPendingAds(response.data);
      });
    });
    await axios.get('http://localhost:4000/ads/getads').then((response) => {
      setExistingAds(response.data);
      setLoading(false)
    });
  }
  useEffect(() => {
    fetchData();
  }, []);
  const handleAccept = (adId) => {
    setSelectedAdId(adId);
    setShowPopup(true);
  };
  const handledelreq = (adId , adname) => {
    console.log(adId , adname);
    set_selected_delete_request({adid:adId , adname :adname});
      setdeletereqpopup(true)  
  };
  const handleSubmitWeight = async () => {
    try {
      setShowPopup(false);
      setLoading(true)
      await axios.post(`http://localhost:4000/ads/add/${selectedAdId}`, { weight }).then(async (response) => {
        alert(response.data.message);
        setLoading(false)
        if (response.statusCode === 200) {
           await fetchData()
        }
      });
      setWeight('');
      // Refresh the ad lists after successful submission
    } catch (error) {
      console.error('Error submitting weight:', error);
    }
  };
  const handleDeleteReq = async (adId) => {
    setdeletereqpopup(false)
    setLoading(true)
    await axios.delete(`http://localhost:4000/ads/delete/request/${adId}`).then(async(response) =>{
      setLoading(false)
    await fetchData()
  })
  }
  const handleDeleteAd = async (adId) => {
    setdeleteadpopup(false)
    setLoading(true)
    await axios.delete(`http://localhost:4000/ads/delete/${adId}`).then(async(response) =>{
      setLoading(false)
    await fetchData()
  })
  }
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="bg-purple-600 p-4">
        <div className="max-w-5xl mx-auto flex">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-2 mx-1 rounded ${
              activeTab === 'requests' ? 'bg-white text-purple-600' : 'bg-purple-700 text-white'
            } transition duration-200`}
          >
            Ad Requests
          </button>
          <button
            onClick={() => setActiveTab('existing')}
            className={`px-3 py-2 mx-1 rounded ${
              activeTab === 'existing' ? 'bg-white text-purple-600' : 'bg-purple-700 text-white'
            } transition duration-200`}
          >
            Existing Ads
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-6">
            {activeTab === 'requests' ? 'Ad Requests' : 'Existing Ads'}
          </h2>

          {loading ? ( 
            <Loader/>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 border-b font-semibold">Company</th>
                  <th className="text-left p-3 border-b font-semibold">Ad Image</th>
                  <th className="text-left p-3 border-b font-semibold">Link</th>
                  {activeTab === 'requests' ? (
                    <>
                      <th className="text-left p-3 border-b font-semibold">Contact</th>
                      <th className="text-left p-3 border-b font-semibold">Price</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left p-3 border-b font-semibold">Clicks</th>
                      <th className="text-left p-3 border-b font-semibold">Weight</th>
                    </>
                  )}
                  <th className="text-right p-3 border-b font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'requests' ? pendingAds : existingAds).map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="p-3 border-b">{ad.adverCompanyName}</td>
                    <td className="p-3 border-b">
                      <a
                        href={`http://localhost:4000/uploads/ads/${ad.AdImgUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`http://localhost:4000/uploads/ads/${ad.AdImgUrl}`}
                          alt={`${ad.adverCompanyName} ad`}
                          className="w-24 h-auto max-h-16 object-cover rounded"
                        />
                      </a>
                    </td>
                    <td className="p-3 border-b">
                      <a href={ad.companyLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                        {ad.companyLink.replace(/^https?:\/\//, '')}
                        <ExternalLink className="ml-1 w-4 h-4" />
                      </a>
                    </td>
                    {activeTab === 'requests' ? (
                      <>
                        <td className="p-3 border-b">
                          <div>{ad.name}</div>
                          <div className="text-sm text-gray-500">{ad.email}</div>
                          <div className="text-sm text-gray-500">{ad.phone}</div>
                        </td>
                        <td className="p-3 border-b">₹{ad.price}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 border-b">{ad.noOfClicks}</td>
                        <td className="p-3 border-b">{ad.weight}</td>
                      </>
                    )}
                    <td className="p-3 border-b text-right">
                      {activeTab === 'requests' ? (
                        <>
                          <button onClick={() => handleAccept(ad._id)} className="p-2 text-green-600 hover:bg-green-100 rounded" aria-label="Accept">
                            <Check />
                          </button>
                          <button onClick={() => handledelreq(ad._id, ad.adverCompanyName)} className="p-2 text-red-600 hover:bg-red-100 rounded" aria-label="Reject">
                            <X />
                          </button>
                        </>
                      ) : (
                        <>
                        <a href={`/ad/analytics/${ad._id}`}>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded" aria-label="View">
                            <Eye />
                          </button>
                        </a>
                          <button onClick={() => {
                            set_selected_delete_ad({ adid: ad._id, adname: ad.adverCompanyName });
                            setdeleteadpopup(true);
                          }} className="p-2 text-red-600 hover:bg-red-100 rounded" aria-label="Delete">
                            <Trash2 />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Accept Ad Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold">Add Weight</h3>
            <input
              type="text"
              placeholder="Enter weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="border rounded p-2 w-full"
            />
            <div className="flex justify-end mt-4">
              <button onClick={handleSubmitWeight} className="bg-blue-500 text-white rounded px-4 py-2">Submit</button>
              <button onClick={() => setShowPopup(false)} className="bg-gray-300 rounded px-4 py-2 ml-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Request Popup */}
      {deletereqpopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold">Delete Request</h3>
            <p>Are you sure you want to delete {selected_delete_request.adname}?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => handleDeleteReq(selected_delete_request.adid)} className="bg-red-500 text-white rounded px-4 py-2">Yes</button>
              <button onClick={() => setdeletereqpopup(false)} className="bg-gray-300 rounded px-4 py-2 ml-2">No</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Ad Popup */}
      {deleteadpopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold">Delete Ad</h3>
            <p>Are you sure you want to delete {selected_delete_ad.adname}?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => handleDeleteAd(selected_delete_ad.adid)} className="bg-red-500 text-white rounded px-4 py-2">Yes</button>
              <button onClick={() => setdeleteadpopup(false)} className="bg-gray-300 rounded px-4 py-2 ml-2">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdPage;
