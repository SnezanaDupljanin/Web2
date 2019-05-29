namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nesto4 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.PriceLists", "From", c => c.DateTime());
            AlterColumn("dbo.PriceLists", "To", c => c.DateTime());
            AlterColumn("dbo.AspNetUsers", "DateOfBirth", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.AspNetUsers", "DateOfBirth", c => c.DateTime(nullable: false));
            AlterColumn("dbo.PriceLists", "To", c => c.DateTime(nullable: false));
            AlterColumn("dbo.PriceLists", "From", c => c.DateTime(nullable: false));
        }
    }
}
