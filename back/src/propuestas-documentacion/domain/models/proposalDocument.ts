// src/propuestas-documentacion/domain/models/proposalDocument.ts
export class ProposalDocument {
    constructor(
        private readonly id: number,
        private readonly uuid: string,
        private readonly proposalId: string,
        private readonly studentId: number,
        private readonly fileName: string,
        private readonly originalFileName: string,
        private readonly fileSize: number,
        private readonly mimeType: string,
        private readonly filePath: string,
        private readonly uploadedAt: Date,
        private readonly active: boolean,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) {}

    getId(): number { return this.id; }
    getUuid(): string { return this.uuid; }
    getProposalId(): string { return this.proposalId; }
    getStudentId(): number { return this.studentId; }
    getFileName(): string { return this.fileName; }
    getOriginalFileName(): string { return this.originalFileName; }
    getFileSize(): number { return this.fileSize; }
    getMimeType(): string { return this.mimeType; }
    getFilePath(): string { return this.filePath; }
    getUploadedAt(): Date { return this.uploadedAt; }
    isActive(): boolean { return this.active; }
    getCreatedAt(): Date { return this.createdAt; }
    getUpdatedAt(): Date { return this.updatedAt; }

    // Métodos de utilidad
    getFileSizeFormatted(): string {
        const bytes = this.fileSize;
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    isPdfFile(): boolean {
        return this.mimeType === 'application/pdf';
    }

    getFileExtension(): string {
        return this.originalFileName.split('.').pop()?.toLowerCase() || '';
    }
}

