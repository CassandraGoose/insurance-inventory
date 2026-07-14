"use client";

type CSVItem = {
  name: string;
  purchaseDate: Date | null;
  category: string;
  description: string | null;
  brand: string | null;
  model: string | null;
  purchasePrice: number;
  currentValue: number | null;
  room: string;
  coverageType: string;
};

export default function ReportDownloadButton({ data }: { data: CSVItem[] }) {
  function handleDownload() {
    const headers = [
      "Name",
      "Purchase Date",
      "Category",
      "Description",
      "Brand",
      "Model",
      "Purchase Price",
      "Current Value",
      "Room Location",
      "Coverage Type",
    ];

    const rows = data.map((item) => [
      item.name,
      item.purchaseDate?.toISOString().split("T")[0] ?? "",
      item.category,
      item.description?.replace(/\n/g, " ") ?? "",
      item.brand ?? "",
      item.model ?? "",
      item.purchasePrice.toString(),
      item.currentValue?.toString(),
      item.room,
      item.coverageType,
    ]);

    const content = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.download = `inventory-items-${new Date(Date.now()).toISOString()}.csv`;
    document.body.appendChild(aTag);
    aTag.click();
    document.body.removeChild(aTag);
    URL.revokeObjectURL(url);
    // todo do the confirmation thing with the speicality photo thing
  }

  return (
    <button
      onClick={handleDownload}
      className="rounded py-2 bg-[#696eb5] p-2 text-white cursor-pointer hover:bg-[#8a8ba6]"
    >
      DOWNLOAD REPORT
    </button>
  );
}
