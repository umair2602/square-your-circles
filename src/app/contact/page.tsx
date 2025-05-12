'use client';
import BrandWatermark from '@/components/common/BrandWatermark';
import Navbar from '@/components/common/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would handle form submission here
        console.log('Form submitted:', formState);
        alert('Thank you for your message! We will get back to you soon.');
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Background watermark */}
            <BrandWatermark opacity={0.05} size="100vh" blur={1.2} />

            {/* Navbar */}
            <Navbar />

            {/* Main content */}
            <main className="pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 tracking-tight">Contact Us</h1>
                    <p className="text-lg text-gray-600 mb-10">
                        Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Name
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formState.name}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formState.email}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject
                                    </label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        value={formState.subject}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Message
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        required
                                        value={formState.message}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <Button
                                        type="submit"
                                        className="bg-gray-900 hover:bg-black text-white rounded-md py-2 px-4 w-full"
                                    >
                                        Send Message
                                    </Button>
                                </div>
                            </form>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                    <p className="text-gray-700">info@squareyourcircles.com</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                    <p className="text-gray-700">+1 (555) 123-4567</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                                    <p className="text-gray-700">
                                        123 Sustainability St<br />
                                        San Francisco, CA 94103<br />
                                        United States
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Office Hours</h3>
                                    <p className="text-gray-700">
                                        Monday - Friday: 9am - 5pm<br />
                                        Saturday - Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 