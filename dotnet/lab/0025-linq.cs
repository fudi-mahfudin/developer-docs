// Lesson 0025 · LINQ untuk live coding. Lab in-memory, .NET 8.
// Cara pakai: dotnet new console -o LinqLab && cd LinqLab
//             ganti isi Program.cs dengan file ini, lalu: dotnet run
// Data sengaja memuat kasus uji: nama Product duplikat (Mouse, Kaos),
// Category tanpa Product (Mainan), dan Product dengan Stock 0.

var categories = new List<Category>
{
    new(1, "Elektronik"),
    new(2, "Buku"),
    new(3, "Pakaian"),
    new(4, "Mainan"),
    new(5, "Dapur"),
};

var products = new List<Product>
{
    new(1,  "Laptop",   15000000m, 5,  1),
    new(2,  "Mouse",      250000m, 0,  1),
    new(3,  "Keyboard",   750000m, 12, 1),
    new(4,  "Monitor",   3000000m, 3,  1),
    new(5,  "Headset",    500000m, 0,  1),
    new(6,  "Novel",      120000m, 20, 2),
    new(7,  "Kamus",      200000m, 0,  2),
    new(8,  "Komik",       50000m, 40, 2),
    new(9,  "Kaos",       100000m, 30, 3),
    new(10, "Jaket",      450000m, 0,  3),
    new(11, "Kaos",        95000m, 10, 3),
    new(12, "Wajan",      300000m, 7,  5),
    new(13, "Mouse",      180000m, 8,  1),
    new(14, "Panci",      350000m, 2,  5),
    new(15, "Spatula",     40000m, 25, 5),
};

// ---------- Demo 1: First / FirstOrDefault / Single / SingleOrDefault ----------
Console.WriteLine("== Demo 1: satu elemen ==");
Console.WriteLine(products.First(p => p.Name == "Mouse").Id);                      // 2 (yang pertama)
Console.WriteLine(products.FirstOrDefault(p => p.Name == "Drone") is null);       // True
Console.WriteLine(products.SingleOrDefault(p => p.Id == 99) is null);             // True
try
{
    products.Single(p => p.Name == "Mouse");                                       // ada dua Mouse
}
catch (InvalidOperationException)
{
    Console.WriteLine("Single: InvalidOperationException (lebih dari satu)");
}

// ---------- Demo 2: multiple enumeration ----------
Console.WriteLine("== Demo 2: multiple enumeration ==");
int calls = 0;
var mahal = products.Where(p => { calls++; return p.Price > 1000000m; });
var jumlah = mahal.Count();      // enumerasi ke-1
var daftar = mahal.ToList();     // enumerasi ke-2: predicate jalan lagi
Console.WriteLine($"{jumlah} produk, predicate dipanggil {calls} kali");          // 2 produk, 30 kali

// ---------- Demo 3: query syntax = method syntax ----------
Console.WriteLine("== Demo 3: query syntax ==");
var q1 = from p in products where p.Stock == 0 orderby p.Name select p.Name;
var q2 = products.Where(p => p.Stock == 0).OrderBy(p => p.Name).Select(p => p.Name);
Console.WriteLine(string.Join(", ", q1));                                          // Headset, Jaket, Kamus, Mouse
Console.WriteLine(q1.SequenceEqual(q2));                                           // True

// ---------- Latihan: tulis jawaban Anda di bawah setiap TODO, lalu dotnet run ----------
Console.WriteLine("== Latihan A: 3 Product termahal per Category ==");
// TODO A

Console.WriteLine("== Latihan B: Category yang tidak punya Product dengan Stock 0 ==");
// TODO B

Console.WriteLine("== Latihan C: nama Product yang duplikat ==");
// TODO C

Console.WriteLine("== Latihan D: total nilai stok (Price x Stock) per Category, terbesar dulu ==");
// TODO D

record Category(int Id, string Name);
record Product(int Id, string Name, decimal Price, int Stock, int CategoryId);
