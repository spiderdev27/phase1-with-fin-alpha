import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Paper, TextField, IconButton, CircularProgress, Alert, Tab, Tabs, Fade, Grow, Slide } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import BarChartIcon from '@mui/icons-material/BarChart';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar
} from 'recharts';
import { generateFinancialAnalysis } from '../services/gemini';

const FinAlpha = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const messagesEndRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const element = messagesEndRef.current;
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      
      if (isAtBottom) {  // Only scroll if user is already near the bottom
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'end'
          });
        }, 100);
      }
    }
  };

  useEffect(() => {
    if (messages.length > 0) {  // Only scroll if there are messages
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (activeAnalysis) {
      // Generate some historical data for visualization
      const newData = Array.from({ length: 7 }, (_, i) => ({
        day: `Day ${i + 1}`,
        confidence: Math.max(0, activeAnalysis.confidence + (Math.random() * 20 - 10))
      }));
      setHistoricalData(newData);
    }
  }, [activeAnalysis]);

  useEffect(() => {
    if (activeAnalysis?.details?.sections?.performance) {
      const extractedData = extractFinancialData(activeAnalysis.details.sections.performance);
      const companyName = activeAnalysis.company || 'Company';
      setPerformanceData(extractedData.length > 0 
        ? extractedData 
        : generateDefaultPerformanceData(companyName)
      );
    }
  }, [activeAnalysis]);

  const processFinancialData = async (text) => {
    // Simulate financial data processing
    const keywords = ['revenue', 'profit', 'growth', 'market', 'stock', 'investment', 'portfolio'];
    const containsFinancialTerms = keywords.some(term => text.toLowerCase().includes(term));
    
    if (containsFinancialTerms) {
      return {
        type: 'analysis',
        data: {
          sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
          confidence: Math.floor(Math.random() * 100),
          metrics: {
            risk: Math.floor(Math.random() * 100),
            potential: Math.floor(Math.random() * 100),
            marketTrend: Math.random() > 0.5 ? 'bullish' : 'bearish'
          }
        }
      };
    }
    return null;
  };

  const generateAIResponse = async (userMessage) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await generateFinancialAnalysis(userMessage);
      
      if (!result || !result.analysis) {
        throw new Error('Invalid response structure');
      }

      const aiResponse = {
        id: Date.now(),
        text: `${result.analysis.summary}\n\n${result.analysis.details.mainPoints.join('\n')}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        analysis: result.analysis
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Update active analysis if available
      if (result.analysis) {
        setActiveAnalysis(result.analysis);
      }

    } catch (error) {
      console.error('Error in generateAIResponse:', error);
      setError(error.message || "Failed to process your request. Please try again.");
      
      const errorMessage = {
        id: Date.now(),
        text: "I apologize, but I encountered an error while analyzing your request. Could you please try rephrasing your question?",
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    await generateAIResponse(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (event) => {
    // TODO: Implement file upload handling
    console.log('File upload:', event.target.files);
  };

  const renderTrendChart = () => (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={historicalData}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="confidence" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderMetricsChart = () => (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={[{
        name: 'Analysis Metrics',
        confidence: activeAnalysis.confidence || 0
      }]}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="confidence" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderSentimentPie = () => {
    const data = [
      { name: 'Positive', value: activeAnalysis?.sentiment === 'positive' ? 1 : 0 },
      { name: 'Negative', value: activeAnalysis?.sentiment === 'negative' ? 1 : 0 }
    ];
    const COLORS = ['#00C49F', '#FF8042'];

    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderPerformanceChart = () => (
    <ChartContainer title="Revenue & Profit Trend">
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8884d8" 
              name="Revenue"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke="#82ca9d" 
              name="Profit"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </ChartContainer>
  );

  const renderMarketShareChart = () => {
    const marketData = activeAnalysis?.details?.sections?.developments
      ? extractMarketShareData(activeAnalysis.details.sections.developments)
      : generateDefaultMarketData();
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>Market Share Distribution</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={marketData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label
            >
              {marketData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderFinancialMetricsChart = () => {
    const metricsData = activeAnalysis?.details?.sections?.performance
      ? extractFinancialMetrics(activeAnalysis.details.sections.performance)
      : generateDefaultMetrics(performanceData || []);

    if (!metricsData || metricsData.length === 0) return null;

    return (
      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>Key Financial Metrics (%)</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8">
              {metricsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#82ca9d' : '#ff8042'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  // Helper functions to extract data from AI response
  const extractFinancialData = (performanceText) => {
    if (!performanceText) return [];

    const data = [];
    const patterns = [
      // Quarter pattern
      /Q([1-4])\s*(?:20\d{2})?[:\s]+(?:revenue|sales)[:\s]+([\d,]+)[^\d]+(profit|net income)[:\s]+([\d,]+)/gi,
      // Month pattern
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[:\s]+(?:revenue|sales)[:\s]+([\d,]+)[^\d]+(profit|net income)[:\s]+([\d,]+)/gi
    ];

    patterns.forEach(regex => {
      let match;
      while ((match = regex.exec(performanceText)) !== null) {
        data.push({
          period: match[1],
          revenue: parseFloat(match[2].replace(/,/g, '')),
          profit: parseFloat(match[4].replace(/,/g, ''))
        });
      }
    });

    // Sort data by period
    return data.sort((a, b) => {
      const periodA = a.period.replace('Q', '');
      const periodB = b.period.replace('Q', '');
      return periodA.localeCompare(periodB);
    });
  };

  const extractMarketShareData = (developmentsText) => {
    const data = [];
    // Extract market share percentages using regex
    const regex = /([A-Za-z\s]+)(?:has|with|at)\s+(\d+(?:\.\d+)?)\s*%/gi;
    let match;

    while ((match = regex.exec(developmentsText)) !== null) {
      data.push({
        name: match[1].trim(),
        value: parseFloat(match[2])
      });
    }

    return data.length > 0 ? data : [{ name: 'No market share data', value: 100 }];
  };

  const extractFinancialMetrics = (performanceText) => {
    const metrics = [];
    // Extract financial metrics using regex
    const metricsToFind = {
      'Revenue Growth': /revenue growth[:\s]+(\d+(?:\.\d+)?)\s*%/i,
      'Profit Margin': /profit margin[:\s]+(\d+(?:\.\d+)?)\s*%/i,
      'ROE': /ROE[:\s]+(\d+(?:\.\d+)?)\s*%/i,
      'Debt Ratio': /debt ratio[:\s]+(\d+(?:\.\d+)?)\s*%/i
    };

    for (const [name, regex] of Object.entries(metricsToFind)) {
      const match = performanceText.match(regex);
      if (match) {
        metrics.push({
          name,
          value: parseFloat(match[1])
        });
      }
    }

    return metrics;
  };

  // Add this helper function at the top
  const getAnalysisSection = (analysis, section) => {
    return analysis?.details?.sections?.[section] || '';
  };

  // Update the renderAnalysisDashboard function
  const renderAnalysisDashboard = () => {
    if (!activeAnalysis) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Overview" />
          <Tab label="Performance" />
          <Tab label="Developments" />
          <Tab label="Outlook" />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ 
            p: 2, 
            bgcolor: 'background.paper', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography variant="body1" paragraph>
              {activeAnalysis.summary || 'No summary available'}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Key Points
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {(activeAnalysis.details?.mainPoints || []).map((point, index) => (
                <Typography key={index} variant="body2" sx={{ 
                  p: 1.5,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  borderLeft: '4px solid',
                  borderColor: 'primary.main'
                }}>
                  {point}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Analysis
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {getAnalysisSection(activeAnalysis, 'performance') || 'No performance data available'}
            </Typography>
            
            {activeAnalysis?.details?.metrics && (
              <>
                {performanceData && performanceData.length > 0 && renderPerformanceChart()}
                {renderFinancialMetricsChart()}
              </>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Market Position & Developments
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {getAnalysisSection(activeAnalysis, 'developments')}
            </Typography>
            
            {renderMarketShareChart()}
            
            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {(activeAnalysis.details?.mainPoints || [])
                .filter(point => point.toLowerCase().includes('announced') || 
                               point.toLowerCase().includes('launched') ||
                               point.toLowerCase().includes('introduced'))
                .map((development, index) => (
                  <Paper key={index} sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    borderLeft: '4px solid',
                    borderColor: 'primary.main'
                  }}>
                    <Typography variant="body2">
                      {development}
                    </Typography>
                  </Paper>
                ))}
            </Box>
          </Box>
        )}

        {activeTab === 3 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Future Outlook & Trends
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {getAnalysisSection(activeAnalysis, 'outlook')}
            </Typography>
            
            {activeAnalysis.details?.trends && renderTrendChart()}
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Growth Indicators
              </Typography>
              {activeAnalysis.details?.metrics && (
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={[
                    { subject: 'Market Growth', value: 80 },
                    { subject: 'Innovation', value: 90 },
                    { subject: 'Competition', value: 70 },
                    { subject: 'Financial Health', value: 85 },
                    { subject: 'Global Presence', value: 75 }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar name="Growth Potential" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  // Update the message display to show structured content
  const renderMessage = (message) => (
    <Box 
      key={message.id}
      sx={{ 
        alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: message.sender === 'user' ? 'primary.main' : 
          message.isError ? 'error.light' : 'grey.200',
        color: message.sender === 'user' ? 'white' : 
          message.isError ? 'error.contrastText' : 'text.primary',
        borderRadius: 2,
        p: 2,
        maxWidth: '80%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)'
        }
      }}
    >
      {message.sender === 'ai' && !message.isError ? (
        <>
          <Typography variant="body1" gutterBottom>
            {message.analysis?.summary || message.text}
          </Typography>
          {message.analysis?.details?.mainPoints && (
            <Box sx={{ mt: 2 }}>
              {message.analysis.details.mainPoints.map((point, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                  {point.startsWith('*Disclaimer:') ? (
                    <Box sx={{ color: 'warning.main', fontStyle: 'italic' }}>
                      {point}
                    </Box>
                  ) : (
                    `• ${point}`
                  )}
                </Typography>
              ))}
            </Box>
          )}
        </>
      ) : (
        <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
          {message.text}
        </Typography>
      )}
    </Box>
  );

  // Add these animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3, when: "beforeChildren", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Update the tab panel rendering
  const TabPanel = ({ children, value, index }) => (
    <Fade in={value === index} timeout={300}>
      <Box
        role="tabpanel"
        hidden={value !== index}
        sx={{ height: value === index ? 'auto' : 0 }}
      >
        {value === index && (
          <Box
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {children}
          </Box>
        )}
      </Box>
    </Fade>
  );

  // Update chart containers with animations
  const ChartContainer = ({ children, title }) => (
    <Box
      sx={{
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'scale(1.1)'
        },
        '&:active': {
          transform: 'scale(0.95)'
        }
      }}
    >
      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>{title}</Typography>
        {children}
      </Box>
    </Box>
  );

  // Update the main layout with animations
  return (
    <Fade in timeout={500}>
      <Container 
        maxWidth={false} 
        sx={{ 
          pt: '100px',
          pb: '120px',
          px: { xs: 2, sm: 3, md: 4 },
          maxWidth: '1800px',
          minHeight: '100vh',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'auto',
          '&::after': {
            content: '""',
            display: 'block',
            height: '100px'
          }
        }}
      >
        {/* Header */}
        <Box sx={{ 
          mb: 3, 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <Box 
            className="header-animation"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#6366F1'
              }}
            >
              Fin
              <Box 
                component="span"
                className="gradient-text-enhanced"
                sx={{ 
                  position: 'relative'
                }}
              >
                Alpha
              </Box>
            </Typography>
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              fontFamily: 'Montserrat',
              fontWeight: 500,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              opacity: 0.9,
              lineHeight: 1.5
            }}
          >
            Your AI-powered financial analysis assistant
          </Typography>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%',
                maxWidth: '600px',
                mx: 'auto'
              }} 
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
        </Box>

        {/* Main content grid */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '350px 1fr',
            lg: '400px 1fr',
          },
          gap: { xs: 2, sm: 3 },
          flexGrow: 1,
          minHeight: 'calc(100vh - 300px)',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Chat Section */}
          <Paper 
            elevation={3} 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100vh - 300px)',
              minHeight: '600px',
              maxHeight: 'calc(100vh - 300px)',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              position: 'sticky',
              top: '84px'
            }}
          >
            {/* Chat Header */}
            <Box sx={{ 
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.default'
            }}>
              <Typography variant="h6">Financial Assistant</Typography>
            </Box>

            {/* Messages Container */}
            <Box sx={{ 
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: 'background.default',
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'primary.light',
                borderRadius: '4px',
              }
            }}>
              {messages.map(renderMessage)}
              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Section */}
            <Box sx={{ 
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.default'
            }}>
              <Box sx={{ 
                display: 'flex',
                gap: 1,
                alignItems: 'flex-end'
              }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Ask about any company's financial data..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  size="small"
                  multiline
                  maxRows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'background.paper'
                    }
                  }}
                />
                <IconButton 
                  color="primary" 
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>

          {/* Analysis Dashboard */}
          <Paper 
            elevation={3} 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100vh - 300px)',
              minHeight: '600px',
              maxHeight: 'calc(100vh - 300px)',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              position: 'sticky',
              top: '84px'
            }}
          >
            {/* Dashboard Header */}
            <Box sx={{ 
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.default',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <BarChartIcon color="primary" />
              <Typography variant="h6">Analysis Dashboard</Typography>
            </Box>

            {/* Dashboard Content */}
            <Box sx={{ 
              flexGrow: 1,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: 'background.default',
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'primary.light',
                borderRadius: '4px',
              }
            }}>
              {activeAnalysis ? (
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                  {renderAnalysisDashboard()}
                </Box>
              ) : (
                <Box sx={{ 
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                  p: 3
                }}>
                  <Typography variant="body1">
                    Ask a question about any company to see detailed analysis here.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
    </Fade>
  );
};

// Add hover animations to interactive elements
const IconButtonAnimated = ({ children, ...props }) => (
  <Box
    sx={{
      transition: 'transform 0.2s ease',
      '&:hover': {
        transform: 'scale(1.1)'
      },
      '&:active': {
        transform: 'scale(0.95)'
      }
    }}
  >
    <IconButton {...props}>
      {children}
    </IconButton>
  </Box>
);

// Add these utility functions at the top
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(value);
};

// Enhanced data generation functions
const generateDefaultPerformanceData = (companyName) => {
  const baseRevenue = Math.random() * 100000 + 50000; // Random base between 50k-150k
  const growthRate = Math.random() * 0.15 + 0.05; // 5-20% growth rate
  const profitMargin = Math.random() * 0.15 + 0.15; // 15-30% profit margin

  return Array.from({ length: 4 }, (_, i) => {
    const quarterRevenue = baseRevenue * Math.pow(1 + growthRate, i);
    const quarterProfit = quarterRevenue * profitMargin;
    
    return {
      period: `Q${i + 1}`,
      revenue: Math.round(quarterRevenue),
      profit: Math.round(quarterProfit),
      growthRate: ((quarterRevenue / baseRevenue - 1) * 100).toFixed(1),
      profitMargin: ((quarterProfit / quarterRevenue) * 100).toFixed(1)
    };
  });
};

const generateDefaultMarketData = (companyName) => {
  const mainCompanyShare = Math.random() * 20 + 25; // 25-45%
  const remainingShare = 100 - mainCompanyShare;
  
  const competitors = [
    { name: 'Competitor 1', shareRange: [0.3, 0.4] },
    { name: 'Competitor 2', shareRange: [0.2, 0.3] },
    { name: 'Others', shareRange: [0.3, 0.4] }
  ];

  let remainingPercentage = remainingShare;
  return [
    { name: companyName || 'Company', value: mainCompanyShare },
    ...competitors.map((comp, index) => {
      const shareRange = comp.shareRange;
      const share = index === competitors.length - 1 
        ? remainingPercentage 
        : remainingPercentage * (Math.random() * (shareRange[1] - shareRange[0]) + shareRange[0]);
      remainingPercentage -= share;
      return { name: comp.name, value: Math.round(share * 10) / 10 };
    })
  ];
};

const generateDefaultMetrics = (performanceData) => {
  // Use performance data to generate realistic metrics if available
  const lastQuarter = performanceData[performanceData.length - 1];
  const firstQuarter = performanceData[0];

  const revenueGrowth = performanceData.length > 1
    ? ((lastQuarter.revenue / firstQuarter.revenue - 1) * 100).toFixed(1)
    : (Math.random() * 20 + 5).toFixed(1);

  const profitMargin = lastQuarter
    ? ((lastQuarter.profit / lastQuarter.revenue) * 100).toFixed(1)
    : (Math.random() * 15 + 10).toFixed(1);

  return [
    {
      name: 'Revenue Growth',
      value: parseFloat(revenueGrowth),
      description: `YoY growth in revenue`,
      trend: revenueGrowth > 10 ? 'positive' : 'neutral'
    },
    {
      name: 'Profit Margin',
      value: parseFloat(profitMargin),
      description: `Net profit margin`,
      trend: profitMargin > 15 ? 'positive' : 'neutral'
    },
    {
      name: 'ROE',
      value: parseFloat((Math.random() * 10 + 8).toFixed(1)),
      description: 'Return on Equity',
      trend: 'neutral'
    },
    {
      name: 'Debt Ratio',
      value: parseFloat((Math.random() * 20 + 30).toFixed(1)),
      description: 'Total Debt to Assets',
      trend: 'negative'
    },
    {
      name: 'Current Ratio',
      value: parseFloat((Math.random() * 0.5 + 1.2).toFixed(2)),
      description: 'Current Assets/Liabilities',
      trend: 'positive'
    }
  ];
};

// Add industry-specific metrics
const generateIndustryMetrics = (industry = 'Auto') => {
  const industries = {
    Auto: {
      metrics: ['Market Share', 'Production Volume', 'Sales Growth', 'Export Revenue'],
      ranges: [[10, 30], [50000, 200000], [5, 25], [20, 40]]
    },
    IT: {
      metrics: ['Client Retention', 'Utilization Rate', 'Digital Revenue', 'Deal Pipeline'],
      ranges: [[85, 95], [70, 85], [30, 50], [40, 60]]
    },
    Banking: {
      metrics: ['NPA Ratio', 'CASA Ratio', 'Credit Growth', 'Net Interest Margin'],
      ranges: [[1, 5], [40, 55], [10, 20], [2, 4]]
    }
  };

  const industryData = industries[industry] || industries.Auto;
  return industryData.metrics.map((metric, index) => ({
    name: metric,
    value: parseFloat((Math.random() * 
      (industryData.ranges[index][1] - industryData.ranges[index][0]) + 
      industryData.ranges[index][0]).toFixed(1))
  }));
};

export default FinAlpha; 