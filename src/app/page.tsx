"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon, Landmark, User, Clock, Megaphone, DollarSign, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// --- (1) SKEMA VALIDASI FORM & TIPE DATA ---
// Skema untuk validasi form tambah kegiatan menggunakan Zod
const formSchema = z.object({
  namaKegiatan: z.string().min(3, { message: "Nama kegiatan minimal 3 karakter." }),
  penceramah: z.string().min(3, { message: "Nama penceramah minimal 3 karakter." }),
  tanggal: z.date({ required_error: "Tanggal harus diisi." }),
  waktu: z.string().nonempty({ message: "Waktu harus diisi." }),
})

// Tipe data untuk jadwal (agar konsisten)
type Jadwal = {
  id: number;
  judul: string;
  penceramah: string;
  tanggal: string;
  waktu: string;
}

// --- (2) DATA DUMMY (Nanti bisa diganti dari API) ---
const DUMMY_JADWAL: Jadwal[] = [
  { id: 1, judul: "Kajian Rutin Ba'da Maghrib: Tafsir Al-Qur'an", penceramah: "Ustadz Abdullah", tanggal: "15 Agustus 2025", waktu: "18:30 WIB" },
  { id: 2, judul: "Kuliah Subuh: Fiqih Ibadah", penceramah: "Ustadz Muhammad", tanggal: "17 Agustus 2025", waktu: "05:30 WIB" },
  { id: 3, judul: "Kajian Muslimah: Peran Wanita dalam Islam", penceramah: "Ustadzah Aisyah", tanggal: "18 Agustus 2025", waktu: "10:00 WIB" },
]

const DUMMY_PENGUMUMAN = [
    { id: 1, judul: "Kerja Bakti Masjid", isi: "Diharapkan kehadiran seluruh jamaah untuk kegiatan kerja bakti membersihkan area masjid pada hari Minggu, 24 Agustus 2025 pukul 08:00 WIB." },
    { id: 2, judul: "Penyaluran Zakat Fitrah", isi: "Penerimaan dan penyaluran zakat fitrah akan dimulai pada tanggal 20 Agustus 2025. Silakan hubungi panitia di sekretariat." },
]


export default function MasjidDashboard() {
  const [jadwalList, setJadwalList] = React.useState<Jadwal[]>(DUMMY_JADWAL);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // --- (3) INISIALISASI FORM ---
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaKegiatan: "",
      penceramah: "",
      waktu: "",
    },
  })

  // --- (4) FUNGSI SUBMIT FORM ---
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Di aplikasi nyata, di sini Anda akan memanggil API (misal dengan Axios)
    // Untuk sekarang, kita hanya tambahkan ke state lokal
    console.log("Data yang akan dikirim:", values)
    
    const newJadwal: Jadwal = {
        id: jadwalList.length + 1,
        judul: values.namaKegiatan,
        penceramah: values.penceramah,
        tanggal: format(values.tanggal, "d MMMM yyyy", { locale: id }),
        waktu: `${values.waktu} WIB`,
    }

    setJadwalList(prevJadwal => [newJadwal, ...prevJadwal]);
    
    // Reset form dan tutup dialog
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* --- HEADER --- */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800 flex items-center justify-center gap-3">
            <Landmark size={40} />
            Sistem Informasi Masjid Al-Hikmah
        </h1>
        <p className="text-gray-600 mt-2">Pusat Informasi Kegiatan dan Keuangan Masjid</p>
      </header>
      
      <Separator className="my-6" />

      {/* --- KONTEN UTAMA DENGAN TABS --- */}
      <Tabs defaultValue="jadwal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jadwal">Jadwal Kegiatan</TabsTrigger>
          <TabsTrigger value="keuangan">Laporan Keuangan</TabsTrigger>
          <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
        </TabsList>

        {/* --- Tab 1: Jadwal Kegiatan --- */}
        <TabsContent value="jadwal">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Jadwal Kegiatan & Kajian</CardTitle>
                    <CardDescription>Informasi kegiatan yang akan datang di Masjid Al-Hikmah.</CardDescription>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kegiatan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Tambah Kegiatan Baru</DialogTitle>
                        <DialogDescription>
                          Isi detail kegiatan di bawah ini. Klik simpan jika sudah selesai.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="namaKegiatan"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nama Kegiatan</FormLabel>
                                <FormControl>
                                  <Input placeholder="Contoh: Kajian Rutin Ba'da Maghrib" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="penceramah"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Penceramah / Pengisi Acara</FormLabel>
                                <FormControl>
                                  <Input placeholder="Contoh: Ustadz Fulan" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="tanggal"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Tanggal Pelaksanaan</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP", { locale: id })
                                        ) : (
                                          <span>Pilih tanggal</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                      initialFocus
                                      locale={id}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="waktu"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Waktu</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="secondary">Batal</Button>
                            </DialogClose>
                            <Button type="submit">Simpan Kegiatan</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jadwalList.map((item) => (
                    <Card key={item.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg">{item.judul}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3">
                             <div className="flex items-center text-sm text-gray-700">
                                <User className="mr-2 h-4 w-4 text-green-700" />
                                <span>{item.penceramah}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                                <CalendarIcon className="mr-2 h-4 w-4 text-green-700" />
                                <span>{item.tanggal}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                                <Clock className="mr-2 h-4 w-4 text-green-700" />
                                <span>{item.waktu}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Tab 2: Laporan Keuangan --- */}
        <TabsContent value="keuangan">
          <Card>
            <CardHeader>
              <CardTitle>Laporan Keuangan</CardTitle>
              <CardDescription>Ringkasan kondisi keuangan masjid per 12 Agustus 2025.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="bg-green-100 border-green-300">
                        <CardHeader>
                            <CardTitle className="flex items-center text-green-800">
                                <DollarSign className="mr-2 h-5 w-5"/> Pemasukan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-green-900">Rp 15.750.000</p>
                        </CardContent>
                    </Card>
                     <Card className="bg-red-100 border-red-300">
                        <CardHeader>
                            <CardTitle className="flex items-center text-red-800">
                               <DollarSign className="mr-2 h-5 w-5"/> Pengeluaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-red-900">Rp 4.200.000</p>
                        </CardContent>
                    </Card>
                     <Card className="bg-blue-100 border-blue-300">
                        <CardHeader>
                            <CardTitle className="flex items-center text-blue-800">
                               <Landmark className="mr-2 h-5 w-5"/> Saldo Akhir
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-blue-900">Rp 11.550.000</p>
                        </CardContent>
                    </Card>
                </div>
                <Separator />
                <div>
                    <h4 className="font-semibold mb-2">Rincian Pengeluaran Utama:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Biaya Listrik & Air: Rp 1.500.000</li>
                        <li>Insentif Marbot & Imam: Rp 2.000.000</li>
                        <li>Perbaikan Atap: Rp 700.000</li>
                    </ul>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Tab 3: Pengumuman --- */}
        <TabsContent value="pengumuman">
          <Card>
            <CardHeader>
              <CardTitle>Pengumuman Masjid</CardTitle>
              <CardDescription>Informasi terbaru untuk jamaah Masjid Al-Hikmah.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {DUMMY_PENGUMUMAN.map(item => (
                <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold text-lg flex items-center mb-1">
                        <Megaphone className="mr-2 h-5 w-5 text-green-700"/>
                        {item.judul}
                    </h3>
                    <p className="text-gray-600">{item.isi}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}