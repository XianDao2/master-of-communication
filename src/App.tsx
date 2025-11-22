import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Assessment from "@/pages/Assessment";
import AIPractice from "@/pages/AIPractice";
import KnowledgeBase from "@/pages/KnowledgeBase";
import ProgressTracking from "@/pages/ProgressTracking";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";
import { useState } from "react";
import { AuthContext, useAuthProvider } from '@/contexts/authContext';

export default function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // 使用自定义Hook获取认证状态和方法
  const authValue = useAuthProvider();

  return (
    <AuthContext.Provider value={authValue}>
      <Navbar showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/ai-practice" element={<AIPractice />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/progress" element={<ProgressTracking />} />
      </Routes>
    </AuthContext.Provider>
  );
}
