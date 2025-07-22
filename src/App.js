import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where, onSnapshot, setLogLevel } from 'firebase/firestore';
import { ArrowRight, User, DollarSign, FileText, CheckSquare, Bell, Send, Folder, Plus, Edit, Trash2, X, Printer, LogOut, Eye, EyeOff } from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// --- Auth Page Component ---
const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            setError('Error: Revisa tu correo y contraseña. La contraseña debe tener al menos 6 caracteres.');
            console.error(err);
        }
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            setError('No se pudo iniciar sesión con Google. Inténtalo de nuevo.');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl dark:bg-gray-800">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400">
                    Accede a tu CRM personalizado
                </p>
                
                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                    <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 398.8 0 256S110.3 0 244 0c69.9 0 131.6 28.3 176.3 74.3l-68.5 68.5c-24.3-23-56.6-36.8-93.2-36.8-69.7 0-126.5 56.8-126.5 126.5s56.8 126.5 126.5 126.5c76.3 0 114.8-52.2 118.9-78.5H244V261.8h244z"></path></svg>
                    Continuar con Google
                </button>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400">O</span>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                </div>

                <form onSubmit={handleAuthAction} className="space-y-6">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        required
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            required
                            className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                           {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {error && <p className="text-sm text-center text-red-500">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
                    >
                        {loading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Registrarse')}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}
                    <button onClick={() => setIsLogin(!isLogin)} className="ml-1 font-medium text-blue-600 hover:underline dark:text-blue-400">
                        {isLogin ? 'Regístrate' : 'Inicia sesión'}
                    </button>
                </p>
            </div>
        </div>
    );
};


// --- Helper Components ---

const Modal = ({ children, onClose, size = 'lg' }) => {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full ${sizeClasses[size]} m-4 relative animate-fade-in-up`}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10">
                    <X size={24} />
                </button>
                <div className="p-6 md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center space-x-4 transition-transform hover:scale-105">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);


// --- Main Application Component ---
export default function App() {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    if (loadingAuth) {
        return <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div></div>;
    }

    if (!user) {
        return <AuthPage />;
    }

    return <CrmApp user={user} />;
}

const CrmApp = ({ user }) => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [clients, setClients] = useState([]);
    const [payments, setPayments] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    const userId = user.uid;

    useEffect(() => {
        if (!userId) return;

        setLoadingData(true);
        const collectionsToSync = {
            clients: (data) => setClients(data.sort((a, b) => a.name.localeCompare(b.name))),
            payments: setPayments,
            taxes: setTaxes,
            tasks: setTasks,
            notifications: setNotifications,
        };

        const unsubscribers = Object.entries(collectionsToSync).map(([collectionName, setter]) => {
            const q = query(collection(db, `/artifacts/${firebaseConfig.appId}/users/${userId}/${collectionName}`));
            return onSnapshot(q, (querySnapshot) => {
                const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setter(items);
            }, (err) => {
                console.error(`Error fetching ${collectionName}:`, err);
                setError(`No se pudieron cargar los datos de ${collectionName}.`);
            });
        });
        
        setLoadingData(false);

        return () => unsubscribers.forEach(unsub => unsub());
    }, [userId]);
    
    // --- Data CRUD Functions ---
    const addData = async (collectionName, data) => {
        try {
            const docRef = await addDoc(collection(db, `/artifacts/${firebaseConfig.appId}/users/${userId}/${collectionName}`), data);
            return docRef;
        } catch (e) { console.error(e); setError(`Error al añadir datos.`); return null; }
    };
    const updateData = async (collectionName, id, data) => {
        try {
            await updateDoc(doc(db, `/artifacts/${firebaseConfig.appId}/users/${userId}/${collectionName}`, id), data);
        } catch (e) { console.error(e); setError(`Error al actualizar datos.`); }
    };
    const deleteData = async (collectionName, id) => {
        try {
            await deleteDoc(doc(db, `/artifacts/${firebaseConfig.appId}/users/${userId}/${collectionName}`, id));
        } catch (e) { console.error(e); setError(`Error al eliminar datos.`); }
    };
    
    // --- Automatic "Just-in-Time" Payment Generation ---
    useEffect(() => {
        if (!userId || clients.length === 0) return;
        const generateCurrentPayments = async () => {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
            const currentMonthName = now.toLocaleString('es-ES', { month: 'long' });
            const capitalizedMonthName = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);
            const isTrimestralMonth = [0, 3, 6, 9].includes(currentMonth);
            const isAnualMonth = currentMonth === 0;

            for (const client of clients) {
                if (!client.fee || !client.billingFrequency) continue;
                let shouldGenerate = false;
                if (client.billingFrequency === 'Mensual') shouldGenerate = true;
                else if (client.billingFrequency === 'Trimestral' && isTrimestralMonth) shouldGenerate = true;
                else if (client.billingFrequency === 'Anual' && isAnualMonth) shouldGenerate = true;

                if (shouldGenerate) {
                    const paymentExists = payments.some(p => p.clientId === client.id && p.year === currentYear && p.month === capitalizedMonthName);
                    if (!paymentExists) {
                        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
                        const newPayment = {
                            clientId: client.id,
                            amount: client.fee,
                            dueDate: firstDayOfMonth.toISOString().split('T')[0],
                            status: 'Pendiente',
                            month: capitalizedMonthName,
                            year: currentYear,
                        };
                        await addData('payments', newPayment);
                    }
                }
            }
        };
        generateCurrentPayments();
    }, [clients, payments, userId]);

    const renderSection = () => {
        if (loadingData) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div></div>;
        if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

        switch (activeSection) {
            case 'dashboard': return <DashboardSection clients={clients} payments={payments} tasks={tasks} />;
            case 'clients': return <ClientsSection clients={clients} addClient={(c) => addData('clients', c)} updateClient={(id, c) => updateData('clients', id, c)} deleteClient={(id) => deleteData('clients', id)} />;
            case 'payments': return <PaymentsSection payments={payments} clients={clients} addPayment={(p) => addData('payments', p)} updatePayment={(id, p) => updateData('payments', id, p)} deletePayment={(id) => deleteData('payments', id)} />;
            case 'taxes': return <TaxesSection taxes={taxes} clients={clients} addTax={(t) => addData('taxes', t)} updateTax={(id, t) => updateData('taxes', id, t)} deleteTax={(id) => deleteData('taxes', id)} />;
            case 'tasks': return <TasksSection tasks={tasks} clients={clients} addTask={(t) => addData('tasks', t)} updateTask={(id, t) => updateData('tasks', id, t)} deleteTask={(id) => deleteData('tasks', id)} />;
            case 'notifications': return <NotificationsSection notifications={notifications} clients={clients} addNotification={(n) => addData('notifications', n)} updateNotification={(id, n) => updateData('notifications', id, n)} deleteNotification={(id) => deleteData('notifications', id)} />;
            case 'circulars': return <CircularsSection clients={clients} />;
            case 'drive': return <DriveSection clients={clients} />;
            default: return <DashboardSection clients={clients} payments={payments} tasks={tasks} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userEmail={user.email} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header sectionTitle={activeSection} />
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
                    {renderSection()}
                </div>
            </main>
        </div>
    );
}

// --- Layout Components ---
const Sidebar = ({ activeSection, setActiveSection, userEmail }) => {
    const navItems = [
        { id: 'dashboard', label: 'Panel Principal', icon: <ArrowRight size={20} /> },
        { id: 'clients', label: 'Clientes', icon: <User size={20} /> },
        { id: 'payments', label: 'Control de Pagos', icon: <DollarSign size={20} /> },
        { id: 'taxes', label: 'Gestión de Impuestos', icon: <FileText size={20} /> },
        { id: 'tasks', label: 'Tareas', icon: <CheckSquare size={20} /> },
        { id: 'notifications', label: 'Notificaciones', icon: <Bell size={20} /> },
        { id: 'circulars', label: 'Envío de Circulares', icon: <Send size={20} /> },
        { id: 'drive', label: 'Almacén (Drive)', icon: <Folder size={20} /> },
    ];

    return (
        <nav className="w-64 bg-white dark:bg-gray-800 shadow-lg flex-col hidden md:flex">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">ClientCRM</h1>
            </div>
            <ul className="flex-1 px-4 py-4 space-y-2">
                {navItems.map(item => (
                    <li key={item.id}>
                        <button
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left font-medium transition-all duration-200 ${
                                activeSection === item.id
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
             <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2" title={userEmail}>{userEmail}</p>
                <button
                    onClick={() => signOut(auth)}
                    className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left font-medium text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                >
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </nav>
    );
};

const Header = ({ sectionTitle }) => (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 border-b dark:border-gray-700">
        <h2 className="text-2xl font-semibold capitalize text-gray-800 dark:text-gray-100">{sectionTitle.replace(/_/g, ' ')}</h2>
    </header>
);

const ClientsSection = ({ clients, addClient, updateClient, deleteClient }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [clientToPrint, setClientToPrint] = useState(null);

    const handleOpenModal = (client = null) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };
    
    const handleOpenPrintModal = (client) => {
        setClientToPrint(client);
        setIsPrintModalOpen(true);
    };

    const handleSaveClient = async (clientData) => {
        if (editingClient) {
            await updateClient(editingClient.id, clientData);
        } else {
            await addClient(clientData);
        }
        setIsModalOpen(false);
        setEditingClient(null);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Gestión de Clientes</h3>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors">
                    <Plus size={20} className="mr-2" /> Añadir Cliente
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Cuota</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Teléfono</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{client.name}</td>
                                <td className="px-6 py-4">{client.fee ? `€${client.fee} (${client.billingFrequency})` : 'N/A'}</td>
                                <td className="px-6 py-4">{client.email}</td>
                                <td className="px-6 py-4">{client.phone}</td>
                                <td className="px-6 py-4 flex space-x-3">
                                    <button onClick={() => handleOpenPrintModal(client)} className="text-gray-500 hover:text-gray-700" title="Imprimir Ficha"><Printer size={18} /></button>
                                    <button onClick={() => handleOpenModal(client)} className="text-blue-500 hover:text-blue-700" title="Editar"><Edit size={18} /></button>
                                    <button onClick={() => {if(window.confirm('¿Seguro que quieres eliminar este cliente? Esta acción no se puede deshacer.')) deleteClient(client.id)}} className="text-red-500 hover:text-red-700" title="Eliminar"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {clients.length === 0 && <p className="p-4 text-center">No hay clientes para mostrar. Añade uno para empezar.</p>}
            </div>
            {isModalOpen && <ClientModal client={editingClient} onSave={handleSaveClient} onClose={() => setIsModalOpen(false)} />}
            {isPrintModalOpen && <ClientPrintView client={clientToPrint} onClose={() => setIsPrintModalOpen(false)} />}
        </div>
    );
};

const ClientModal = ({ client, onSave, onClose }) => {
    const ALL_TAX_MODELS = ['100', '111', '115', '130', '180', '190', '200', '202', '303', '349', '390'];
    const initialTaxObligations = ALL_TAX_MODELS.reduce((acc, model) => {
        acc[model] = client?.taxObligations?.[model] || false;
        return acc;
    }, {});

    const [formData, setFormData] = useState({
        name: client?.name || '', dni: client?.dni || '', email: client?.email || '',
        phone: client?.phone || '', address: client?.address || '',
        bankAccount: client?.bankAccount || '', driveFolderId: client?.driveFolderId || '',
        fee: client?.fee || '', billingFrequency: client?.billingFrequency || 'Mensual',
        taxObligations: initialTaxObligations,
    });

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            taxObligations: { ...prev.taxObligations, [name]: checked }
        }));
    };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <Modal onClose={onClose} size="xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">{client ? 'Editar Cliente' : 'Añadir Nuevo Cliente'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre Completo" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                    <input type="text" name="dni" value={formData.dni} onChange={handleChange} placeholder="DNI/NIE" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Dirección" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" rows="2"></textarea>
                <input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleChange} placeholder="Número de Cuenta Bancaria (IBAN)" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    <input type="number" name="fee" value={formData.fee} onChange={handleChange} placeholder="Cuota (€)" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                    <select name="billingFrequency" value={formData.billingFrequency} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <option value="">Sin Recurrencia</option>
                        <option value="Mensual">Mensual</option>
                        <option value="Trimestral">Trimestral</option>
                        <option value="Anual">Anual</option>
                    </select>
                </div>
                <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Obligaciones Fiscales</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ALL_TAX_MODELS.map(model => (
                            <label key={model} className="flex items-center space-x-2">
                                <input type="checkbox" name={model} checked={!!formData.taxObligations[model]} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span>Modelo {model}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <input type="text" name="driveFolderId" value={formData.driveFolderId} onChange={handleChange} placeholder="ID de Carpeta de Google Drive" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mt-4" />
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">Guardar</button>
                </div>
            </form>
        </Modal>
    );
};

const ClientPrintView = ({ client, onClose }) => {
    const printRef = useRef();
    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = `<div class="p-10">${printContents}</div>`;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };
    
    const obligations = Object.entries(client.taxObligations || {})
        .filter(([, value]) => value)
        .map(([key]) => `Modelo ${key}`)
        .join(', ');

    return (
        <Modal onClose={onClose} size="xl">
            <div ref={printRef} className="printable-content">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Ficha de Cliente</h2>
                <div className="space-y-3">
                    <p><strong>Nombre:</strong> {client.name}</p>
                    <p><strong>DNI/NIE:</strong> {client.dni}</p>
                    <p><strong>Email:</strong> {client.email || 'N/A'}</p>
                    <p><strong>Teléfono:</strong> {client.phone || 'N/A'}</p>
                    <p><strong>Dirección:</strong> {client.address || 'N/A'}</p>
                    <p><strong>Cuenta Bancaria:</strong> {client.bankAccount || 'N/A'}</p>
                    <p><strong>Cuota:</strong> {client.fee ? `€${client.fee} (${client.billingFrequency})` : 'N/A'}</p>
                    <p><strong>Obligaciones Fiscales:</strong> {obligations || 'Ninguna'}</p>
                    <p><strong>Carpeta Drive ID:</strong> {client.driveFolderId || 'N/A'}</p>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200">Cerrar</button>
                <button type="button" onClick={handlePrint} className="flex items-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                    <Printer size={18} className="mr-2" /> Imprimir
                </button>
            </div>
        </Modal>
    );
};

const PaymentsSection = ({ payments, clients, addPayment, updatePayment, deletePayment }) => {
    const [filter, setFilter] = useState('Todos');
    
    const handleAddPayment = () => {
        if(clients.length === 0) {
            alert("Primero debe añadir un cliente.");
            return;
        }
        const monthName = new Date().toLocaleString('es-ES', { month: 'long' });
        addPayment({
            clientId: clients[0].id, amount: '', dueDate: new Date().toISOString().split('T')[0],
            status: 'Pendiente', month: monthName.charAt(0).toUpperCase() + monthName.slice(1), year: new Date().getFullYear()
        });
    };

    const togglePaymentStatus = (payment) => {
        const newStatus = payment.status === 'Pendiente' ? 'Pagado' : 'Pendiente';
        updatePayment(payment.id, { status: newStatus });
    };

    const filteredPayments = payments.filter(p => filter === 'Todos' || p.status === filter)
                                     .sort((a,b) => new Date(b.dueDate) - new Date(a.dueDate));

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Control de Pagos</h3>
                <div className="flex items-center space-x-4">
                    <select onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600">
                        <option>Todos</option><option>Pendiente</option><option>Pagado</option>
                    </select>
                    <button onClick={handleAddPayment} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors">
                        <Plus size={20} className="mr-2" /> Añadir Pago Manual
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Cliente</th>
                                <th className="px-6 py-3">Periodo</th>
                                <th className="px-6 py-3">Vencimiento</th>
                                <th className="px-6 py-3">Importe</th>
                                <th className="px-6 py-3 text-center">Estado</th>
                                <th className="px-6 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map(payment => {
                                const client = clients.find(c => c.id === payment.clientId);
                                return (
                                    <tr key={payment.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{client?.name || 'N/A'}</td>
                                        <td className="px-6 py-4">{payment.month} {payment.year}</td>
                                        <td className="px-6 py-4"><input type="date" value={payment.dueDate} onChange={(e) => updatePayment(payment.id, { dueDate: e.target.value })} className="bg-transparent dark:text-white"/></td>
                                        <td className="px-6 py-4">
                                            <input type="number" value={payment.amount} onChange={(e) => updatePayment(payment.id, { amount: e.target.value })} placeholder="€" className="w-24 p-1 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${payment.status === 'Pagado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex justify-center items-center space-x-2">
                                            <button onClick={() => togglePaymentStatus(payment)} className={`px-3 py-1 rounded-md text-sm text-white ${payment.status === 'Pendiente' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}>
                                                {payment.status === 'Pendiente' ? 'Pagar' : 'Revertir'}
                                            </button>
                                            <button onClick={() => {if(window.confirm('¿Eliminar este registro de pago?')) deletePayment(payment.id)}} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredPayments.length === 0 && <p className="p-4 text-center">No hay pagos para mostrar con el filtro actual.</p>}
                </div>
            </div>
        </div>
    );
};

const TaxesSection = ({ taxes, clients, addTax, updateTax, deleteTax }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTax, setEditingTax] = useState(null);

    const handleOpenModal = (tax = null) => {
        setEditingTax(tax);
        setIsModalOpen(true);
    };

    const handleSaveTax = (taxData) => {
        if (editingTax) {
            updateTax(editingTax.id, taxData);
        } else {
            addTax(taxData);
        }
        setIsModalOpen(false);
        setEditingTax(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Presentado': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Pendiente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Revisado': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Gestión de Impuestos</h3>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors">
                    <Plus size={20} className="mr-2" /> Añadir Impuesto
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Cliente</th>
                            <th className="px-6 py-3">Impuesto</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3">Enlace Drive</th>
                            <th className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taxes.map(tax => {
                            const client = clients.find(c => c.id === tax.clientId);
                            return (
                                <tr key={tax.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{client?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">{tax.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tax.status)}`}>{tax.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {tax.driveLink && <a href={tax.driveLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ver Documento</a>}
                                    </td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button onClick={() => handleOpenModal(tax)} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                                        <button onClick={() => {if(window.confirm('¿Eliminar este impuesto?')) deleteTax(tax.id)}} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {taxes.length === 0 && <p className="p-4 text-center">No hay impuestos registrados.</p>}
            </div>
            {isModalOpen && <TaxModal tax={editingTax} clients={clients} onSave={handleSaveTax} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

const TaxModal = ({ tax, clients, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        clientId: tax?.clientId || (clients[0]?.id || ''),
        name: tax?.name || '',
        status: tax?.status || 'Pendiente',
        driveLink: tax?.driveLink || '',
    });

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <Modal onClose={onClose}>
            <h2 className="text-2xl font-bold mb-6">{tax ? 'Editar Impuesto' : 'Añadir Impuesto'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select name="clientId" value={formData.clientId} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required>
                    <option value="" disabled>Selecciona un cliente</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre del Impuesto (ej. IVA 3T 2024)" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <option>Pendiente</option><option>Presentado</option><option>Revisado</option>
                </select>
                <input type="url" name="driveLink" value={formData.driveLink} onChange={handleChange} placeholder="Enlace al documento en Drive" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">Guardar</button>
                </div>
            </form>
        </Modal>
    );
};

const TasksSection = ({ tasks, clients, addTask, updateTask, deleteTask }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const handleOpenModal = (task = null) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleSaveTask = (taskData) => {
        if (editingTask) {
            updateTask(editingTask.id, taskData);
        } else {
            addTask(taskData);
        }
        setIsModalOpen(false);
        setEditingTask(null);
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'Realizada': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Pendiente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'En tramitación': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Tareas por Cliente</h3>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors">
                    <Plus size={20} className="mr-2" /> Añadir Tarea
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                 <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Cliente</th>
                            <th className="px-6 py-3">Tarea</th>
                            <th className="px-6 py-3">Vencimiento</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => {
                            const client = clients.find(c => c.id === task.clientId);
                            return (
                                <tr key={task.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{client?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">{task.description}</td>
                                    <td className="px-6 py-4">{task.dueDate}</td>
                                    <td className="px-6 py-4">
                                        <select value={task.status} onChange={(e) => updateTask(task.id, { status: e.target.value })} className={`p-1 border-0 rounded text-xs font-semibold ${getStatusColor(task.status)}`}>
                                            <option>Pendiente</option>
                                            <option>En tramitación</option>
                                            <option>Realizada</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button onClick={() => handleOpenModal(task)} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                                        <button onClick={() => {if(window.confirm('¿Eliminar esta tarea?')) deleteTask(task.id)}} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {tasks.length === 0 && <p className="p-4 text-center">No hay tareas pendientes.</p>}
            </div>
            {isModalOpen && <TaskModal task={editingTask} clients={clients} onSave={handleSaveTask} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

const TaskModal = ({ task, clients, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        clientId: task?.clientId || (clients[0]?.id || ''),
        description: task?.description || '',
        dueDate: task?.dueDate || new Date().toISOString().split('T')[0],
        status: task?.status || 'Pendiente',
    });

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <Modal onClose={onClose}>
            <h2 className="text-2xl font-bold mb-6">{task ? 'Editar Tarea' : 'Añadir Tarea'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select name="clientId" value={formData.clientId} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required>
                    <option value="" disabled>Selecciona un cliente</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción de la tarea" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <option>Pendiente</option><option>En tramitación</option><option>Realizada</option>
                </select>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">Guardar</button>
                </div>
            </form>
        </Modal>
    );
};

const NotificationsSection = ({ notifications, clients, addNotification, updateNotification, deleteNotification }) => {
    const [filters, setFilters] = useState({ client: 'Todos', status: 'Todos' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotification, setEditingNotification] = useState(null);

    const handleOpenModal = (notification = null) => {
        setEditingNotification(notification);
        setIsModalOpen(true);
    };

    const handleSave = (data) => {
        if (editingNotification) {
            updateNotification(editingNotification.id, data);
        } else {
            addNotification(data);
        }
        setIsModalOpen(false);
        setEditingNotification(null);
    };

    const filteredNotifications = notifications.filter(n => {
        const clientMatch = filters.client === 'Todos' || n.clientId === filters.client;
        const statusMatch = filters.status === 'Todos' || n.status === filters.status;
        return clientMatch && statusMatch;
    });
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'Resuelta': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Pendiente de abrir': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'Abierta': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'En tramitación': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Notificaciones</h3>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors">
                    <Plus size={20} className="mr-2" /> Crear Notificación
                </button>
            </div>
            <div className="mb-4 flex space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <select value={filters.client} onChange={e => setFilters({...filters, client: e.target.value})} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <option value="Todos">Todos los Clientes</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <option>Todos</option><option>Pendiente de abrir</option><option>Abierta</option><option>En tramitación</option><option>Resuelta</option>
                </select>
            </div>
            <div className="space-y-3">
                {filteredNotifications.map(n => {
                    const client = clients.find(c => c.id === n.clientId);
                    return (
                        <div key={n.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(n.status)}`}>{n.status}</span>
                                    <p className="font-bold mt-2">{n.title}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{n.description}</p>
                                    <p className="text-xs text-gray-400 mt-2">Cliente: {client?.name || 'General'}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleOpenModal(n)} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                                    <button onClick={() => {if(window.confirm('¿Eliminar esta notificación?')) deleteNotification(n.id)}} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filteredNotifications.length === 0 && <p className="p-4 text-center bg-white dark:bg-gray-800 rounded-lg">No hay notificaciones con los filtros actuales.</p>}
            </div>
            {isModalOpen && <NotificationModal notification={editingNotification} clients={clients} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

const NotificationModal = ({ notification, clients, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        clientId: notification?.clientId || (clients[0]?.id || ''),
        title: notification?.title || '',
        description: notification?.description || '',
        status: notification?.status || 'Pendiente de abrir',
    });

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    
    return (
        <Modal onClose={onClose}>
            <h2 className="text-2xl font-bold mb-6">{notification ? 'Editar Notificación' : 'Crear Notificación'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select name="clientId" value={formData.clientId} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required>
                    <option value="" disabled>Selecciona un cliente</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Título" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <option>Pendiente de abrir</option><option>Abierta</option><option>En tramitación</option><option>Resuelta</option>
                </select>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">Guardar</button>
                </div>
            </form>
        </Modal>
    );
};

const DashboardSection = ({ clients, payments, tasks }) => {
    const totalClients = clients.length;
    const pendingPayments = payments.filter(p => p.status === 'Pendiente').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pendiente' || t.status === 'En tramitación').length;
    const totalRevenue = payments.filter(p => p.status === 'Pagado').reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return (
        <div className="animate-fade-in">
            <h3 className="text-2xl font-bold mb-6">Resumen General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<User size={24} className="text-white"/>} title="Total Clientes" value={totalClients} color="bg-blue-500" />
                <StatCard icon={<DollarSign size={24} className="text-white"/>} title="Ingresos Totales" value={`€${totalRevenue.toFixed(2)}`} color="bg-green-500" />
                <StatCard icon={<Bell size={24} className="text-white"/>} title="Pagos Pendientes" value={pendingPayments} color="bg-yellow-500" />
                <StatCard icon={<CheckSquare size={24} className="text-white"/>} title="Tareas Pendientes" value={pendingTasks} color="bg-red-500" />
            </div>
        </div>
    );
};
const CircularsSection = ({ clients }) => (
    <div className="animate-fade-in">
        <h3 className="text-2xl font-bold mb-6">Envío de Circulares</h3>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold mb-2">Redactar Mensaje</h4>
                    <textarea placeholder="Escribe tu circular aquí..." className="w-full h-48 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"></textarea>
                    <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Enviar Circular</button>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Seleccionar Destinatarios</h4>
                    <div className="h-48 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 space-y-2">
                        {clients.map(client => (
                            <div key={client.id} className="flex items-center">
                                <input type="checkbox" id={`client-${client.id}`} className="mr-2"/>
                                <label htmlFor={`client-${client.id}`}>{client.name}</label>
                            </div>
                        ))}
                        {clients.length === 0 && <p className="text-sm text-center">No hay clientes.</p>}
                    </div>
                     <button className="mt-2 w-full bg-gray-200 dark:bg-gray-600 py-1 rounded-lg text-sm">Seleccionar Todos</button>
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Nota: Esta es una simulación. La funcionalidad de envío real requeriría un servicio de correo electrónico.</p>
        </div>
    </div>
);
const DriveSection = ({ clients }) => (
    <div className="animate-fade-in">
        <h3 className="text-2xl font-bold mb-6">Almacén de Archivos (Google Drive)</h3>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="text-gray-600 dark:text-gray-300 mb-4">Esta sección simula el acceso a las carpetas de Google Drive de cada cliente. En una versión completa, al hacer clic se abriría la carpeta real del cliente en una nueva pestaña.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {clients.map(client => (
                    <a 
                        key={client.id} 
                        href={client.driveFolderId ? `https://drive.google.com/drive/folders/${client.driveFolderId}` : '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-4 border rounded-lg flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow ${!client.driveFolderId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <Folder size={40} className="text-yellow-500 mb-2" />
                        <span className="font-medium text-sm">{client.name}</span>
                        {!client.driveFolderId && <span className="text-xs text-red-500">(Sin ID)</span>}
                    </a>
                ))}
                {clients.length === 0 && <p className="col-span-full text-center">No hay clientes para mostrar.</p>}
            </div>
            <p className="text-xs text-gray-500 mt-4">Nota: Para que esto funcione, debes añadir el "ID de Carpeta de Google Drive" al editar cada cliente. El ID se encuentra en la URL de la carpeta de Drive.</p>
        </div>
    </div>
);
