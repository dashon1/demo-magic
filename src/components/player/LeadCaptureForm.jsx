import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { Mail, User, Building, Phone } from "lucide-react";

export default function LeadCaptureForm({ demoId, onSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
    phone: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name) {
      toast.error("Name and email are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const lead = await base44.entities.LeadCapture.create({
        demo_id: demoId,
        ...formData,
        source: document.referrer || "Direct"
      });

      // Send notification
      await base44.functions.invoke('sendLeadNotification', {
        lead_id: lead.id
      });

      toast.success("Thank you! We'll be in touch soon.");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error("Failed to submit. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
        <p className="text-sm text-slate-600">
          Interested? Leave your details and we'll reach out!
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Full Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Company Name"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="pl-10"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="pl-10"
            />
          </div>

          <Textarea
            placeholder="Any specific questions or requirements?"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}