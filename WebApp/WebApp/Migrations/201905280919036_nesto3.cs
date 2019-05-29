namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nesto3 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Tickets", "DateOfPurchase", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Tickets", "DateOfPurchase", c => c.DateTime(nullable: false));
        }
    }
}
