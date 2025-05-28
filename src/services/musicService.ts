
export class MusicService {
  private isPlaying = false;
  private currentSong = '';

  getSongRecommendations(query: string): string[] {
    const songs = [
      'Shape of You - Ed Sheeran',
      'Blinding Lights - The Weeknd',
      'Levitating - Dua Lipa',
      'Watermelon Sugar - Harry Styles',
      'Good 4 U - Olivia Rodrigo',
      'Stay - The Kid LAROI & Justin Bieber',
      'Industry Baby - Lil Nas X',
      'Heat Waves - Glass Animals',
      'As It Was - Harry Styles',
      'Running Up That Hill - Kate Bush'
    ];

    const teluguSongs = [
      'Samajavaragamana - Ala Vaikunthapurramuloo',
      'Ramuloo Ramulaa - Ala Vaikunthapurramuloo',
      'Inkem Inkem - Geetha Govindam',
      'Maate Vinadhuga - Taxiwaala',
      'Buttabomma - Ala Vaikunthapurramuloo',
      'Dandaalayyaa - Baahubali 2',
      'Dheevara - Baahubali',
      'Vachaadayyo Saami - Shyam Singha Roy',
      'Kala Chashma - Baar Baar Dekho',
      'Rowdy Baby - Maari 2'
    ];

    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('telugu') || lowerQuery.includes('తెలుగు')) {
      return teluguSongs;
    }

    // Filter songs based on query
    const filtered = songs.filter(song => 
      song.toLowerCase().includes(lowerQuery) ||
      lowerQuery.includes(song.toLowerCase().split(' - ')[0].toLowerCase()) ||
      lowerQuery.includes(song.toLowerCase().split(' - ')[1]?.toLowerCase() || '')
    );

    return filtered.length > 0 ? filtered : songs.slice(0, 5);
  }

  async playSong(songName: string): Promise<string> {
    // Simulate playing a song (in real app, you'd integrate with Spotify, YouTube Music, etc.)
    this.isPlaying = true;
    this.currentSong = songName;
    
    return `🎵 Now playing: ${songName}. Enjoy your music! 🎶`;
  }

  stopMusic(): string {
    this.isPlaying = false;
    const wasStopped = this.currentSong;
    this.currentSong = '';
    return `🔇 Stopped playing: ${wasStopped}`;
  }

  getCurrentSong(): string {
    return this.currentSong;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}
