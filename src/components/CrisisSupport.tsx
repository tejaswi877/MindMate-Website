
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake, Phone, MessageCircle, Globe, Clock, AlertTriangle } from "lucide-react";

const CrisisSupport = () => {
  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support for people experiencing suicidal, substance use, and/or mental health crisis",
      available: "24/7",
      type: "Call/Text",
    },
    {
      name: "Crisis Text Line",
      number: "741741",
      description: "Text HOME to 741741 for free, 24/7 crisis support",
      available: "24/7",
      type: "Text",
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Treatment referral and information service for mental health and substance use disorders",
      available: "24/7",
      type: "Call",
    },
    {
      name: "National Child Abuse Hotline",
      number: "1-800-4-A-CHILD (1-800-422-4453)",
      description: "Professional crisis counselors provide support to children, parents, and families",
      available: "24/7",
      type: "Call",
    },
    {
      name: "National Domestic Violence Hotline",
      number: "1-800-799-7233",
      description: "Confidential support for people experiencing domestic violence",
      available: "24/7",
      type: "Call/Chat",
    },
    {
      name: "LGBT National Hotline",
      number: "1-888-843-4564",
      description: "Peer-support for LGBT community members",
      available: "Daily 4PM-12AM ET",
      type: "Call",
    },
  ];

  const localResources = [
    {
      name: "Emergency Services",
      number: "911",
      description: "For immediate life-threatening emergencies",
      type: "Emergency",
    },
    {
      name: "Local Crisis Center",
      description: "Search for crisis centers in your area",
      website: "https://findtreatment.samhsa.gov/",
      type: "Website",
    },
  ];

  const copingStrategies = [
    {
      title: "Grounding Technique (5-4-3-2-1)",
      description: "Name 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, 1 thing you taste",
    },
    {
      title: "Deep Breathing",
      description: "Breathe in for 4 counts, hold for 4, breathe out for 6. Repeat several times",
    },
    {
      title: "Safe Space Visualization",
      description: "Close your eyes and imagine a place where you feel completely safe and calm",
    },
    {
      title: "Reach Out",
      description: "Call or text a trusted friend, family member, or counselor",
    },
    {
      title: "Remove Yourself",
      description: "If possible, leave the situation or environment that's causing distress",
    },
  ];

  const makeCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const openWebsite = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Crisis Alert */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            If you are in immediate danger, call 911
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">
            If you or someone you know is in immediate danger or having thoughts of self-harm, 
            please call emergency services immediately.
          </p>
          <Button 
            onClick={() => makeCall("911")} 
            className="bg-red-600 hover:bg-red-700"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call 911
          </Button>
        </CardContent>
      </Card>

      {/* National Crisis Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-blue-500" />
            National Crisis Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {crisisResources.map((resource, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-lg">{resource.name}</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {resource.available}
                    </Badge>
                    <Badge variant="secondary">
                      {resource.type}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                <Button 
                  onClick={() => makeCall(resource.number)}
                  className="flex items-center gap-2"
                >
                  {resource.type.includes("Text") ? (
                    <MessageCircle className="h-4 w-4" />
                  ) : (
                    <Phone className="h-4 w-4" />
                  )}
                  {resource.number}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Local Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-500" />
            Local & Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {localResources.map((resource, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{resource.name}</h3>
                  <Badge variant={resource.type === "Emergency" ? "destructive" : "outline"}>
                    {resource.type}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                {resource.number && (
                  <Button 
                    onClick={() => makeCall(resource.number)}
                    variant={resource.type === "Emergency" ? "destructive" : "default"}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {resource.number}
                  </Button>
                )}
                {resource.website && (
                  <Button 
                    onClick={() => openWebsite(resource.website)}
                    variant="outline"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Immediate Coping Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Immediate Coping Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {copingStrategies.map((strategy, index) => (
              <div key={index} className="p-4 border rounded-lg bg-blue-50">
                <h3 className="font-medium text-blue-900 mb-2">{strategy.title}</h3>
                <p className="text-blue-700 text-sm">{strategy.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Note */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-2">Important Note</h3>
              <p className="text-yellow-700 text-sm">
                MindMate is designed to provide support and resources, but it is not a replacement for professional 
                mental health care. If you're experiencing a mental health crisis or having thoughts of self-harm, 
                please reach out to a crisis hotline or emergency services immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrisisSupport;
