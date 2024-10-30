import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css'; // Ensure this path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import Font Awesome
import { faRobot, faFileAlt, faPaintBrush, faChartLine } from '@fortawesome/free-solid-svg-icons'; // Import specific icons

export default function Home() {
    const initialCount = 50; // Starting counter
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [count, setCount] = useState(initialCount); // Starting counter
    const [faqOpen, setFaqOpen] = useState(null); // Track which FAQ is open

    useEffect(() => {
        const storedCount = localStorage.getItem('userCount');
        if (storedCount) {
            setCount(Number(storedCount)); // Set count from localStorage
        } else {
            localStorage.setItem('userCount', initialCount); // Initialize in localStorage
        }

        const interval = setInterval(() => {
            setCount(prevCount => {
                const newCount = prevCount + 1;
                localStorage.setItem('userCount', newCount); // Update in localStorage
                return newCount;
            });
        }, 5000); // Increment every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/waitlist', { email });
            if (response.data.success) {
                setMessage('Thank you for joining the waitlist!');
                setEmail(''); // Clear the input field
                setCount(prevCount => {
                    const newCount = prevCount + 1;
                    localStorage.setItem('userCount', newCount); // Update in localStorage
                    return newCount;
                });
            } else {
                setMessage('Something went wrong, please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Something went wrong, please try again.');
        }
    };

    const toggleFaq = (index) => {
        setFaqOpen(faqOpen === index ? null : index); // Toggle open/close
    };

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <header className={styles.hero}>
                <h1>Unlock the Ultimate AI-Driven Link-in-Bio Experience!</h1>
                <p className={styles.waitlistMessage}>Join the waitlist today and be among the first to experience the power of LinkMilo!</p>
                <form onSubmit={handleSubmit} className={styles.waitlistForm}>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Enter your email" 
                        required 
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>Join the Waitlist</button>
                </form>
                <p className={styles.signupCounter}>{count}+ creators have already signed up!</p>
            </header>

            {/* Features Section */}
            <section className={styles.features}>
                <h2>Why Choose LinkMilo?</h2>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <FontAwesomeIcon icon={faRobot} size="3x" className={styles['icon-ai']} />
                        <h3>AI Username & Bio Generator</h3>
                        <p>Let AI suggest creative usernames and bios tailored to your style.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <FontAwesomeIcon icon={faFileAlt} size="3x" className={styles['icon-template']} />
                        <h3>Customizable Templates</h3>
                        <p>Choose from a variety of layouts that suit your brand.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <FontAwesomeIcon icon={faPaintBrush} size="3x" className={styles['icon-color']} />
                        <h3>Color Palette Selector</h3>
                        <p>Express your brand with professionally designed color schemes.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <FontAwesomeIcon icon={faChartLine} size="3x" className={styles['icon-analytics']} />
                        <h3>Analytics Dashboard</h3>
                        <p>Get insights on clicks, engagement, and audience growth.</p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className={styles.faq}>
                <h2>Frequently Asked Questions</h2>
                {[
                    { question: "Is LinkMilo free?", answer: "Yes, absolutely! For now, LinkMilo is completely free! You can dive in and enjoy all the awesome features we offer without spending a dime. Our mission is to help creators like you thrive without the pressure of upfront costs. So, take advantage of everything we have while it’s still free!" },
                    { question: "Who is this tool for?", answer: "LinkMilo is designed for everyone! Whether you’re a content creator, influencer, or a business looking to enhance your online presence, LinkMilo has something for you. Our tool allows personal brands of all types to create stunning link pages that showcase their work and connect with their audience effectively. It's perfect for anyone who wants to make a memorable impression online." },
                    { question: "What are the AI capabilities in LinkMilo?", answer: "Our AI is like your creative buddy! It can whip up catchy usernames and personalized bios that reflect your unique style. Plus, it’ll suggest color palettes that perfectly match your vibe, making it super easy to create a stunning link page. We're all about helping you stand out and engage with your audience effectively." },
                    { question: "How does LinkMilo compare to other link-in-bio tools?", answer: "Great question! While other tools might offer just the basics, LinkMilo goes a step further. We combine easy customization with smart AI features and powerful analytics. This means you can create a truly personalized link-in-bio page while gaining insights into how your audience interacts with your content. We're committed to evolving and providing you with an all-in-one solution that grows alongside you!" },
                    { question: "What templates and color palettes can I use?", answer: "You'll love this! LinkMilo comes loaded with a variety of customizable templates to fit your brand's personality. Whether you're into a clean, minimalistic look or something more colorful and vibrant, we've got you covered. Plus, our AI will help you choose the best color combinations that express who you are. Mix and match until it feels just right!" },
                    { question: "How much will premium plans cost after launch?", answer: "Right now, we’re focused on keeping LinkMilo free. But as we grow and add even more fantastic features, we’ll consider introducing a paid plan in the future. Here’s the best part: if you join our waitlist, you could score discounts of up to 80% when we launch those paid options! Early supporters like you will get some sweet perks, so don’t miss out!" }
                ].map((item, index) => (
                    <div key={index} className={styles.faqItem}>
                        <h4 onClick={() => toggleFaq(index)} className={styles.faqQuestion}>
                            {faqOpen === index ? '▼' : '▲'} {/* Inverted V symbol */}
                            {item.question}
                        </h4>
                        {faqOpen === index && (
                            <p className={styles.faqAnswer}>
                                {item.answer}
                            </p>
                        )}
                    </div>
                ))}
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>&copy; 2024 LinkMilo. All rights reserved.</p>
            </footer>
        </div>
    );
}
