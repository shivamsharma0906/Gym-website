import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollStory from './components/ScrollStory';
import About from './components/About';
import Programs from './components/Programs';
import WorkoutGuide from './components/WorkoutGuide';
import DietPlans from './components/DietPlans';
import Trainers from './components/Trainers';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MotivationalQuotes from './components/MotivationalQuotes';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <MotivationalQuotes />
        <ScrollStory />
        <About />
        <Programs />
        <WorkoutGuide />
        <DietPlans />
        <Trainers />
        <Pricing />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
