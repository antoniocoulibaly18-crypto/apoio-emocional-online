"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Mail, MessageCircle, Heart } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    contactType: "email",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contacto" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Estamos aqui para si</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Registe-se para ter acesso aos nossos serviços ou entre em contacto connosco. O seu bem-estar é a nossa
            prioridade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Registration Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Heart className="w-5 h-5 text-primary" />
                Registo Rápido
              </CardTitle>
              <CardDescription>Crie a sua conta para aceder aos nossos serviços de apoio emocional</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-card-foreground">
                    Nome completo
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="O seu nome"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-2"
                    required
                  />
                </div>

                <Tabs defaultValue="email" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefone
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="email" className="mt-4">
                    <Label htmlFor="email" className="text-card-foreground">
                      Endereço de email
                    </Label>
                    <Input
                      id="email"
                      name="contact"
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={formData.contactType === "email" ? formData.contact : ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          contact: e.target.value,
                          contactType: "email",
                        })
                      }}
                      className="mt-2"
                      required
                    />
                  </TabsContent>

                  <TabsContent value="phone" className="mt-4">
                    <Label htmlFor="phone" className="text-card-foreground">
                      Número de telefone
                    </Label>
                    <Input
                      id="phone"
                      name="contact"
                      type="tel"
                      placeholder="+244 941 983 180"
                      value={formData.contactType === "phone" ? formData.contact : ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          contact: e.target.value,
                          contactType: "phone",
                        })
                      }}
                      className="mt-2"
                      required
                    />
                  </TabsContent>
                </Tabs>

                <div>
                  <Label htmlFor="message" className="text-card-foreground">
                    Mensagem (opcional)
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Conte-nos como podemos ajudá-lo..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="mt-2 min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Criar Conta
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Precisa de ajuda imediata?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Se está a passar por uma crise emocional ou tem pensamentos suicidas, não hesite em procurar ajuda
                  imediatamente.
                </p>
                <div className="space-y-4">
                  <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Conversar Agora
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    <Phone className="w-5 h-5 mr-2" />
                    Linha de Emergência
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Informações de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">Email</p>
                    <p className="text-muted-foreground">apoioemocionalangola@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">Telefone</p>
                    <p className="text-muted-foreground">+244 941 983 180</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/40 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">Chat Online</p>
                    <p className="text-muted-foreground">Disponível 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
