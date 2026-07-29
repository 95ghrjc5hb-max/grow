import express from 'express';

const router = express.Router();

// ==========================================
// 📊 GET /api/dashboard/stats
// ==========================================
router.get('/stats', async (req, res) => {
  try {
    // Note: Later we can fetch real data from MongoDB here using your Order and User schemas.
    // For now, sending structured dynamic data for the UI.
    
    const dashboardData = {
      totalOrders: 142,
      ordersGrowth: "+18% this month",
      connectedChannels: 2,
      maxChannels: 3,
      activeConversations: 29,
      revenue: 3850,
      recentOrders: [
        {
          id: "ORD-9021",
          customer: "Tanvir Ahmed",
          channel: "WhatsApp",
          amount: 120,
          status: "Completed",
          date: "Just now"
        },
        {
          id: "ORD-9020",
          customer: "Nusrat Jahan",
          channel: "Facebook Messenger",
          amount: 85,
          status: "Processing",
          date: "12 mins ago"
        }
      ]
    };

    return res.status(200).json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve dashboard analytics.' 
    });
  }
});

export default router;
