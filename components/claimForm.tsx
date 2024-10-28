'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

const stations = [
  { id: "f4d25596-a9f9-41a1-b200-713439d92fc4", name: "Stockholm" },
  { id: "cf09cbb1-fd82-4b83-9c09-87bc8fc2f018", name: "Uppsala" },
]

const defaultCustomer = {
  customer: {
    id: "00000000-0000-0000-0000-000000000000",
    firstName: "",
    surName: "",
    city: "",
    postalCode: "",
    streetNameAndNumber: "",
    identityNumber: "",
    bankAccountNumber: "",
    mobileNumber: "",
    email: "",
    clearingNumber: "",
  },
  ticketNumber: "",
  ticketType: 1,
  departureStationId: "",
  arrivalStationId: "",
  fullTicketRefund: false,
  departureDate: "",
  status: 0,
  trainNumber: "20958",
  refundType: {
    id: "00000000-0000-0000-0000-000000000000",
    name: "Payment via Swedbank SUS",
  },
  claimReceipts: [],
}

export function RefinedClaimFormComponent() {
  const [formData, setFormData] = useState(defaultCustomer)

  useEffect(() => {
    const savedData = localStorage.getItem('claimFormData')
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('claimFormData', JSON.stringify(formData))
    toast.success('Sparat framgångsrikt!', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      customer: {
        ...prevData.customer,
        [name]: value,
      },
    }))
  }

  const handleMainInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

  };

  const handleStationChange = (value: string, type: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [type]: value,
    }))
  }

  const confirmSubmit = async () => {
    try {

      const formattedFormData = {
        ...formData,
        departureDate: new Date(formData.departureDate).toISOString(),
      };

      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'accept': 'application/json;charset=UTF-8',
          'content-type': 'application/json',
        },
        body: JSON.stringify(formattedFormData),
      })

      if (response.ok) {
        toast.success('Reklamationen skickades framgångsrikt!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        toast.error('Något gick fel vid skickandet av reklamationen.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Ett fel inträffade vid anslutningen till servern.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl bg-white shadow-md relative">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4">
          <Github className="h-6 w-6 text-gray-500 hover:text-gray-700" />
        </a>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">Skicka in din reklamation</CardTitle>
          <CardDescription className="text-lg text-gray-600">Vi hjälper dig med din återbetalning</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl bg-gray-100 p-1">
                <TabsTrigger value="personal" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-800">
                  Personlig information
                </TabsTrigger>
                <TabsTrigger value="trip" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-800">
                  Reseinformation
                </TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">Förnamn</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.customer.firstName}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surName" className="text-gray-700">Efternamn</Label>
                    <Input
                      id="surName"
                      name="surName"
                      value={formData.customer.surName}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="identityNumber" className="text-gray-700">Personnummer</Label>
                    <Input
                      id="identityNumber"
                      name="identityNumber"
                      value={formData.customer.identityNumber}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">E-post</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.customer.email}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber" className="text-gray-700">Mobilnummer</Label>
                    <Input
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.customer.mobileNumber}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streetNameAndNumber" className="text-gray-700">Gatuadress</Label>
                    <Input
                      id="streetNameAndNumber"
                      name="streetNameAndNumber"
                      value={formData.customer.streetNameAndNumber}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-gray-700">Stad</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.customer.city}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-gray-700">Postnummer</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.customer.postalCode}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="trip" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ticketNumber" className="text-gray-700">Biljettnummer</Label>
                    <Input
                      id="ticketNumber"
                      name="ticketNumber"
                      value={formData.ticketNumber}
                      onChange={handleMainInputChange}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departureStationId" className="text-gray-700">Avgångsstation</Label>
                    <Select
                      value={formData.departureStationId}
                      onValueChange={(value) => handleStationChange(value, 'departureStationId')}
                    >
                      <SelectTrigger className="border-gray-300 focus:ring-blue-500">
                        <SelectValue placeholder="Välj avgångsstation" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station.id} value={station.id}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrivalStationId" className="text-gray-700">Ankomststation</Label>
                    <Select
                      value={formData.arrivalStationId}
                      onValueChange={(value) => handleStationChange(value, 'arrivalStationId')}
                    >
                      <SelectTrigger className="border-gray-300 focus:ring-blue-500">
                        <SelectValue placeholder="Välj ankomststation" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station.id} value={station.id}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departureDate" className="text-gray-700">Avgångsdatum</Label>
                    <Input
                      id="departureDate"
                      name="departureDate"
                      type="datetime-local"
                      value={formData.departureDate}
                      onChange={handleMainInputChange}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-between">
              <Button type="button" onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                Spara utkast
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Skicka reklamation
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                    <AlertDialogDescription>
                      <p>Headers:</p>
                      <pre>{JSON.stringify({
                        'accept': 'application/json;charset=UTF-8',
                        'content-type': 'application/json',
                      }, null, 2)}</pre>
                      <p>Payload:</p>
                      <pre>{JSON.stringify(formData, null, 2)}</pre>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button className="bg-gray-600 hover:bg-gray-700 text-white">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button onClick={confirmSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">Accept</Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  )
}
