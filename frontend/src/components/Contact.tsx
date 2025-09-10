import React, { useState } from 'react';
import { contactService } from '../services/api';
import './Contact.css';

interface FormData {
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [submitType, setSubmitType] = useState<'success' | 'error'>('success');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await contactService.sendMessage({
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        sujet: formData.sujet,
        message: formData.message
      });

      setSubmitType('success');
      setSubmitMessage('Votre message a été envoyé avec succès ! Nous vous recontacterons rapidement.');
      
      // Reset form
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      });
    } catch (error) {
      setSubmitType('error');
      setSubmitMessage('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
      console.error('Erreur envoi formulaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">Contactez-nous</h2>
          <p className="section-subtitle">
            Une question ? Un projet ? N'hésitez pas à nous contacter
          </p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info animate-on-scroll">
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <h4>Adresse</h4>
                <p>4 Zac des Bregaudieres<br />17390 La Tremblade</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <h4>Téléphone</h4>
                <p>
                  <a href="tel:0546368283">05 46 36 82 83</a>
                </p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div>
                <h4>Email</h4>
                <p>
                  <a href="mailto:etsrousez@gmail.com">etsrousez@gmail.com</a>
                </p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">🕒</div>
              <div>
                <h4>Horaires</h4>
                <div className="horaires-details">
                  <div className="horaire-item">
                    <span className="jour">Lundi</span>
                    <span className="horaire">09h-12h / 14h-16h</span>
                  </div>
                  <div className="horaire-item">
                    <span className="jour">Mardi</span>
                    <span className="horaire">09h-12h / 14h-16h</span>
                  </div>
                  <div className="horaire-item">
                    <span className="jour">Mercredi</span>
                    <span className="horaire">09h-12h</span>
                  </div>
                  <div className="horaire-item">
                    <span className="jour">Jeudi</span>
                    <span className="horaire">09h-12h / 14h-16h</span>
                  </div>
                  <div className="horaire-item">
                    <span className="jour">Vendredi</span>
                    <span className="horaire">09h-12h / 14h-16h</span>
                  </div>
                  <div className="horaire-item fermé">
                    <span className="jour">Samedi</span>
                    <span className="horaire">Fermé</span>
                  </div>
                  <div className="horaire-item fermé">
                    <span className="jour">Dimanche</span>
                    <span className="horaire">Fermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <form className="contact-form animate-on-scroll" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                placeholder="Votre nom"
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Votre email"
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                placeholder="Votre téléphone"
              />
            </div>
            
            <div className="form-group">
              <select
                name="sujet"
                value={formData.sujet}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionnez un service</option>
                <option value="chauffage">Chauffage</option>
                <option value="climatisation">Climatisation</option>
                <option value="plomberie">Plomberie</option>
                <option value="sanitaire">Sanitaire</option>
                <option value="depannage">Dépannage</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            
            <div className="form-group">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Décrivez votre projet ou problème"
                rows={5}
                required
              />
            </div>

            {submitMessage && (
              <div className={`submit-message ${submitType}`}>
                {submitMessage}
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Envoi en cours...
                </>
              ) : (
                'Envoyer le message'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
