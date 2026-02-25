import React, { useState } from 'react';
import { UserSettings } from '../types';
import { Save, User, Utensils, Clock, AlertTriangle, Upload } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}


const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [showDpDropdown, setShowDpDropdown] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('profilePicture', reader.result as string);
        setShowDpDropdown(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field: keyof UserSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleArrayChange = (field: 'allergies' | 'cuisinePreferences', value: string) => {
    const arr = formData[field];
    if (arr.includes(value)) {
        handleChange(field, arr.filter(i => i !== value));
    } else {
        handleChange(field, [...arr, value]);
    }
  };

  const handleSave = () => {
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="pt-20 pb-24 px-4 max-w-3xl mx-auto min-h-screen">
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-500 shadow-lg cursor-pointer transition-all hover:scale-110 hover:rotate-3 active:scale-95 bg-white" onClick={() => setShowDpDropdown(!showDpDropdown)}>
                <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover animate-bounce-subtle" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white font-bold uppercase">Change</span>
                </div>
            </div>
            
            {showDpDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-4">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-4 px-1 flex justify-between items-center">
                        <span>Profile Picture</span>
                        <button onClick={() => setShowDpDropdown(false)} className="text-gray-300 hover:text-gray-500 text-xl font-bold">×</button>
                    </div>

                    <div className="space-y-3">
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-xs font-bold transition-all border-2 border-dashed border-orange-200 hover:border-orange-400 group/btn"
                        >
                            <Upload size={18} className="group-hover/btn:scale-110 transition-transform" />
                            <span>Upload Custom Portrait</span>
                        </button>
                        <p className="text-[10px] text-gray-400 text-center px-2 italic">
                            Choose a high-quality image from your device to personalize your chef profile.
                        </p>
                    </div>
                </div>
            )}
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Mr. Chef Settings</h1>
            <p className="text-sm text-gray-500">Profile & culinary preferences.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Profile */}
        <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-orange-600 font-medium">
                <User size={18} /> <span>Profile Details</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select 
                        value={formData.language}
                        onChange={(e) => handleChange('language', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Marathi</option>
                        <option>Spanish</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Dietary */}
        <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-orange-600 font-medium">
                <Utensils size={18} /> <span>Diet & Cuisine</span>
            </div>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Diet Type</label>
                <div className="flex gap-2">
                    {['Veg', 'Non-Veg', 'Vegan'].map(type => (
                        <button
                            key={type}
                            onClick={() => handleChange('dietType', type)}
                            className={`px-4 py-2 rounded-lg text-sm border ${formData.dietType === type ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-gray-200 text-gray-600'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Cuisines</label>
                 <div className="flex flex-wrap gap-2">
                    {['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai'].map(c => (
                        <button
                            key={c}
                            onClick={() => handleArrayChange('cuisinePreferences', c)}
                            className={`px-3 py-1 rounded-full text-xs border ${formData.cuisinePreferences.includes(c) ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-200 text-gray-600'}`}
                        >
                            {c}
                        </button>
                    ))}
                 </div>
            </div>
        </div>

        {/* Allergies & Skill */}
        <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-4 text-red-500 font-medium">
                        <AlertTriangle size={18} /> <span>Allergies</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['Nuts', 'Dairy', 'Gluten', 'Eggs', 'Shellfish'].map(a => (
                            <button
                                key={a}
                                onClick={() => handleArrayChange('allergies', a)}
                                className={`px-3 py-1 rounded-full text-xs border ${formData.allergies.includes(a) ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200 text-gray-600'}`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4 text-blue-500 font-medium">
                        <Clock size={18} /> <span>Skill Level</span>
                    </div>
                    <div className="flex gap-2">
                        {['Beginner', 'Intermediate', 'Expert'].map(level => (
                            <button
                                key={level}
                                onClick={() => handleChange('skillLevel', level)}
                                className={`px-3 py-1.5 rounded-lg text-xs border ${formData.skillLevel === level ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-600'}`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <span className="text-xs text-gray-500">Preferences persist across sessions.</span>
            <button 
                onClick={handleSave}
                className="flex items-center bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-black transition-colors"
            >
                <Save size={18} className="mr-2" />
                {isSaved ? 'Saved!' : 'Save Changes'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
